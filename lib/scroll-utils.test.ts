import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSmoothScrollHandler, smoothScroll } from "@/lib/scroll-utils";

describe("smooth scrolling", () => {
  let animationFrames: FrameRequestCallback[];

  beforeEach(() => {
    animationFrames = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 100,
    });
  });

  it("animates from the current position to the target", () => {
    const target = document.createElement("section");
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      ...target.getBoundingClientRect(),
      top: 300,
    });

    smoothScroll(target, 1000);
    animationFrames.shift()?.(0);
    animationFrames.shift()?.(500);
    animationFrames.shift()?.(1000);

    expect(window.scrollTo).toHaveBeenNthCalledWith(1, 0, 100);
    expect(window.scrollTo).toHaveBeenNthCalledWith(2, 0, 250);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 400);
  });

  it("prevents hash navigation and scrolls to the matching element", () => {
    const target = document.createElement("section");
    target.id = "contact";
    document.body.append(target);
    const anchor = document.createElement("a");
    anchor.setAttribute("href", "#contact");
    const event = {
      currentTarget: anchor,
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent<HTMLAnchorElement>;

    createSmoothScrollHandler(250)(event);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(animationFrames).toHaveLength(1);
  });

  it("leaves non-hash links alone", () => {
    const anchor = document.createElement("a");
    anchor.setAttribute("href", "https://example.com");
    const event = {
      currentTarget: anchor,
      preventDefault: vi.fn(),
    } as unknown as React.MouseEvent<HTMLAnchorElement>;

    createSmoothScrollHandler()(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(animationFrames).toHaveLength(0);
  });
});
