import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FirstScreenBackdrop } from "../components/FirstScreenBackdrop";

describe("FirstScreenBackdrop", () => {
  it("is decoration only: hidden from assistive tech, not clickable, and has no text, links or media", () => {
    const { container } = render(<FirstScreenBackdrop reduce={false} />);
    const root = screen.getByTestId("first-screen-backdrop");
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.className).toContain("pointer-events-none");
    expect(container.textContent).toBe("");
    expect(container.querySelector("video, audio, img, a, button")).toBeNull();
  });

  it("draws the same frames with reduced motion, as a still", () => {
    const moving = render(<FirstScreenBackdrop reduce={false} />);
    const still = render(<FirstScreenBackdrop reduce />);
    expect(still.container.querySelectorAll("span").length).toBe(moving.container.querySelectorAll("span").length);
  });
});
