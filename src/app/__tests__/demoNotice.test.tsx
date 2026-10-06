import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DemoModeNotice } from "../components/DemoModeNotice";

beforeEach(() => sessionStorage.clear());

describe("demo mode notice", () => {
  it("states that data stays on the device and can be dismissed for the session", async () => {
    const { unmount } = render(<DemoModeNotice mode="demo" />);
    expect(screen.getByText(/data stays on this device/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByText(/data stays on this device/i)).toBeNull();
    unmount();
    render(<DemoModeNotice mode="demo" />);
    expect(screen.queryByText(/data stays on this device/i)).toBeNull();
  });
  it("is not shown when a real backend is in use", () => {
    render(<DemoModeNotice mode="supabase" />);
    expect(screen.queryByText(/demo mode/i)).toBeNull();
  });
});
