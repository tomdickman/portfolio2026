import type { HTMLAttributes, PropsWithChildren } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Contact from "@/components/portfolio/contact";

vi.mock("framer-motion", () => {
  type MotionProps<T extends HTMLElement> = PropsWithChildren<
    HTMLAttributes<T>
  > & {
    animate?: unknown;
    initial?: unknown;
    transition?: unknown;
    variants?: unknown;
  };

  return {
    motion: {
      div: ({
        children,
        variants: _variants,
        initial: _initial,
        animate: _animate,
        transition: _transition,
        ...props
      }: MotionProps<HTMLDivElement>) => <div {...props}>{children}</div>,
      p: ({
        children,
        variants: _variants,
        initial: _initial,
        animate: _animate,
        transition: _transition,
        ...props
      }: MotionProps<HTMLParagraphElement>) => <p {...props}>{children}</p>,
    },
    useInView: () => true,
  };
});

async function completeForm() {
  const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: "Name" }), "Alice");
  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "alice@example.com",
  );
  await user.type(
    screen.getByRole("textbox", { name: "Message" }),
    "Hello there",
  );
  return user;
}

describe("Contact", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("submits valid contact details and confirms success", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 200 }));
    render(<Contact />);
    const user = await completeForm();

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Thanks for reaching out!",
      );
    });
    expect(fetch).toHaveBeenCalledWith("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alice@example.com",
        message: "Hello there",
        name: "Alice",
        website: "",
      }),
    });
  });

  it("shows a targeted message when the API rate-limits submission", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 429 }));
    render(<Contact />);
    const user = await completeForm();

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Too many messages have been submitted",
    );
  });

  it("shows the fallback message after a network failure", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));
    render(<Contact />);
    const user = await completeForm();

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "email me directly",
    );
  });

  it("does not submit invalid form values", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Alice");
    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "not-an-email",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Message" }),
      "Hello there",
    );
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(fetch).not.toHaveBeenCalled();
  });
});
