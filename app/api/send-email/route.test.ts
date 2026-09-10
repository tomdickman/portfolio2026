// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mailMocks = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  createTransport: mailMocks.createTransport,
}));

const validSubmission = {
  email: "alice@example.com",
  message: "Hello from the contact form",
  name: "Alice",
  website: "",
};

function createRequest(
  body: BodyInit | null = JSON.stringify(validSubmission),
  headers: Record<string, string> = {},
) {
  return new Request("https://tomdickman.dev/api/send-email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://tomdickman.dev",
      "x-real-ip": "203.0.113.1",
      ...headers,
    },
    body,
  });
}

async function loadPost() {
  const route = await import("@/app/api/send-email/route");
  return route.POST;
}

async function captureExpectedLog<T>(
  method: "error" | "warn",
  message: string,
  action: () => Promise<T>,
) {
  const logSpy = vi.spyOn(console, method).mockImplementation(() => undefined);

  try {
    const result = await action();
    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith(message);
    return result;
  } finally {
    logSpy.mockRestore();
  }
}

describe("POST /api/send-email", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("ZOHO_USERNAME", "mailer@example.com");
    vi.stubEnv("ZOHO_PASSWORD", "secret");
    vi.stubEnv("ZOHO_EMAIL", "portfolio@example.com");
    vi.stubEnv("CONTACT_EMAIL", "inbox@example.com");
    mailMocks.sendMail.mockReset().mockResolvedValue({ messageId: "123" });
    mailMocks.createTransport.mockReset().mockReturnValue({
      sendMail: mailMocks.sendMail,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects cross-origin requests before processing their body", async () => {
    const POST = await loadPost();
    const response = await POST(
      createRequest(JSON.stringify(validSubmission), {
        origin: "https://attacker.example",
      }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Request origin not allowed",
    });
    expect(mailMocks.createTransport).not.toHaveBeenCalled();
  });

  it("accepts the canonical site when supplied through the referer", async () => {
    const POST = await loadPost();
    const request = createRequest();
    request.headers.delete("origin");
    request.headers.set("referer", "https://www.tomdickman.dev/contact");

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it("requires a JSON content type", async () => {
    const POST = await loadPost();
    const response = await POST(
      createRequest("hello", { "content-type": "text/plain" }),
    );

    expect(response.status).toBe(415);
  });

  it("returns a useful response for malformed JSON", async () => {
    const POST = await loadPost();
    const response = await POST(createRequest("{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON" });
  });

  it("rejects submissions that fail schema validation", async () => {
    const POST = await loadPost();
    const response = await POST(
      createRequest(JSON.stringify({ ...validSubmission, email: "invalid" })),
    );

    expect(response.status).toBe(400);
    expect(mailMocks.createTransport).not.toHaveBeenCalled();
  });

  it("rejects bodies over the configured size limit", async () => {
    const POST = await loadPost();
    const response = await POST(
      createRequest("{}", { "content-length": "10001" }),
    );

    expect(response.status).toBe(413);
  });

  it("silently accepts honeypot submissions without sending mail", async () => {
    const POST = await loadPost();
    const response = await captureExpectedLog(
      "warn",
      "Contact form honeypot triggered",
      () =>
        POST(
          createRequest(
            JSON.stringify({
              ...validSubmission,
              website: "https://spam.example",
            }),
          ),
        ),
    );

    expect(response.status).toBe(200);
    expect(mailMocks.createTransport).not.toHaveBeenCalled();
  });

  it("reports unavailable email configuration", async () => {
    vi.stubEnv("ZOHO_PASSWORD", "");
    const POST = await loadPost();

    const response = await captureExpectedLog(
      "error",
      "Email configuration is incomplete",
      () => POST(createRequest()),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Email service is unavailable",
    });
  });

  it("sanitizes input and sends mail through the configured account", async () => {
    const POST = await loadPost();
    const response = await POST(
      createRequest(
        JSON.stringify({
          ...validSubmission,
          message: "Hello <strong>there</strong>",
          name: "<b>Alice</b>",
        }),
      ),
    );

    expect(response.status).toBe(200);
    expect(mailMocks.createTransport).toHaveBeenCalledWith({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: { user: "mailer@example.com", pass: "secret" },
    });
    expect(mailMocks.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: {
          name: "Tom Dickman portfolio",
          address: "portfolio@example.com",
        },
        to: "inbox@example.com",
        replyTo: { name: "Alice", address: "alice@example.com" },
        text: "From: Alice (alice@example.com)\n\nHello there",
      }),
    );
    expect(mailMocks.sendMail.mock.calls[0]?.[0].html).not.toContain("<b>");
    expect(mailMocks.sendMail.mock.calls[0]?.[0].html).not.toContain(
      "<strong>there</strong>",
    );
  });

  it("does not expose mail transport failures", async () => {
    mailMocks.sendMail.mockRejectedValueOnce(new Error("SMTP details"));
    const POST = await loadPost();

    const response = await captureExpectedLog(
      "error",
      "Contact form email delivery failed",
      () => POST(createRequest()),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to send email",
    });
  });

  it("rate-limits a client after five submissions", async () => {
    const POST = await loadPost();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await POST(createRequest());
      expect(response.status).toBe(200);
    }

    const response = await captureExpectedLog(
      "warn",
      "Contact form request rate-limited",
      () => POST(createRequest()),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("600");
    expect(mailMocks.sendMail).toHaveBeenCalledTimes(5);
  });
});
