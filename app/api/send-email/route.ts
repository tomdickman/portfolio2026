import { createTransport } from "nodemailer";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const allowedOrigins = new Set([
  "https://tomdickman.dev",
  "https://www.tomdickman.dev",
]);
const maxRequestBytes = 10_000;
const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const maxTrackedClients = 10_000;

const contactFormSchema = z.object({
  email: z.email().max(254),
  message: z.string().trim().min(1).max(5_000),
  name: z.string().trim().min(1).max(100),
  website: z.string().max(200).optional().default(""),
});

const defaultContactEmail = "tom@tomdickman.dev";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitEntries = new Map<string, RateLimitEntry>();

class RequestTooLargeError extends Error {}

function getRequestOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");

  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function isAllowedOrigin(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return false;
  }

  const requestOrigin = getRequestOrigin(request);

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    return true;
  }

  return (
    process.env.NODE_ENV !== "production" &&
    requestOrigin !== null &&
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin)
  );
}

function getClientIdentifier(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function applyRateLimit(request: Request) {
  const now = Date.now();

  for (const [key, entry] of rateLimitEntries) {
    if (entry.resetAt <= now) {
      rateLimitEntries.delete(key);
    }
  }

  const clientIdentifier = getClientIdentifier(request);
  const currentEntry = rateLimitEntries.get(clientIdentifier);

  if (!currentEntry) {
    if (rateLimitEntries.size >= maxTrackedClients) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(rateLimitWindowMs / 1_000),
      };
    }

    rateLimitEntries.set(clientIdentifier, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (currentEntry.count >= maxRequestsPerWindow) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((currentEntry.resetAt - now) / 1_000),
      ),
    };
  }

  currentEntry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

async function readLimitedJson(request: Request) {
  const contentLength = request.headers.get("content-length");

  if (contentLength && Number(contentLength) > maxRequestBytes) {
    throw new RequestTooLargeError();
  }

  if (!request.body) {
    return null;
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    receivedBytes += value.byteLength;

    if (receivedBytes > maxRequestBytes) {
      await reader.cancel();
      throw new RequestTooLargeError();
    }

    chunks.push(value);
  }

  const body = new Uint8Array(receivedBytes);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(body));
}

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return Response.json(
        { error: "Request origin not allowed" },
        { status: 403 },
      );
    }

    if (
      request.headers.get("content-type")?.split(";")[0] !== "application/json"
    ) {
      return Response.json(
        { error: "Content type must be application/json" },
        { status: 415 },
      );
    }

    const rateLimit = applyRateLimit(request);

    if (!rateLimit.allowed) {
      console.warn("Contact form request rate-limited");
      return Response.json(
        { error: "Too many submissions. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    const result = contactFormSchema.safeParse(await readLimitedJson(request));

    if (!result.success) {
      return Response.json(
        { error: "Invalid form submission" },
        { status: 400 },
      );
    }

    const { name, email, message, website } = result.data;

    // Silently accept honeypot submissions so bots cannot adapt to the field.
    if (website) {
      console.warn("Contact form honeypot triggered");
      return Response.json({ success: true }, { status: 200 });
    }

    // Sanitise all user inputs.
    const sanitised = {
      name: sanitizeHtml(name, { allowedTags: [] }),
      email: sanitizeHtml(email, { allowedTags: [] }),
      message: sanitizeHtml(message, { allowedTags: [] }),
    };

    const smtpUser = process.env.ZOHO_USERNAME;
    const smtpPassword = process.env.ZOHO_PASSWORD;
    const senderEmail = process.env.ZOHO_EMAIL ?? smtpUser;
    const contactEmail = process.env.CONTACT_EMAIL ?? defaultContactEmail;

    if (!smtpUser || !smtpPassword || !senderEmail) {
      console.error("Email configuration is incomplete");
      return Response.json(
        { error: "Email service is unavailable" },
        { status: 500 },
      );
    }

    const transporter = createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: { name: "Tom Dickman portfolio", address: senderEmail },
      to: contactEmail,
      replyTo: { name: sanitised.name, address: sanitised.email },
      subject: "New portfolio contact form submission",
      text: `From: ${sanitised.name} (${sanitised.email})\n\n${sanitised.message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>From:</strong> ${sanitised.name} (${sanitised.email})</p>
        <p><strong>Message:</strong></p>
        <p>${sanitised.message}</p>
      `,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof RequestTooLargeError) {
      return Response.json({ error: "Request is too large" }, { status: 413 });
    }

    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    console.error("Contact form email delivery failed");
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
