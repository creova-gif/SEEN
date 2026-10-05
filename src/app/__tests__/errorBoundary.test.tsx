import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary, crashEscape } from "../components/ErrorBoundary";

describe("crash escape route", () => {
  it("leaves For You for Explore, including a blank hash", () => {
    for (const hash of ["", "#", "#/", "#/for-you", "#/for-you/", "#/for-you?x=1"]) {
      expect(crashEscape(hash)).toMatchObject({ actionLabel: "Open Explore", target: "#/explore" });
    }
  });

  it("returns every other screen to For You", () => {
    for (const hash of ["#/explore", "#/explore/creators", "#/library", "#/profile", "#/search", "#/story/midnight-resonance"]) {
      expect(crashEscape(hash)).toMatchObject({ actionLabel: "Back to For You", target: "#/for-you" });
    }
  });
});

function Boom(): never {
  throw new Error("forced screen error");
}

describe("ErrorBoundary fallback", () => {
  it("reloads Explore when For You is the screen that crashed", async () => {
    window.location.hash = "#/for-you";
    const reload = vi.fn();
    vi.spyOn(window.location, "reload").mockImplementation(reload);

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    await userEvent.click(screen.getByRole("button", { name: /open explore/i }));
    expect(window.location.hash).toBe("#/explore");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("reloads For You when another screen crashed", async () => {
    window.location.hash = "#/library";
    const reload = vi.fn();
    vi.spyOn(window.location, "reload").mockImplementation(reload);

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    await userEvent.click(screen.getByRole("button", { name: /back to for you/i }));
    expect(window.location.hash).toBe("#/for-you");
    expect(reload).toHaveBeenCalledOnce();
  });
});
