import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Checkbox, PasswordField, RadioGroup, SearchBar, TextField, Toggle } from "../components/seen/forms";
import { ConfirmDialog, Drawer, Sheet } from "../components/seen/overlays";
import { ChapterRow, CircularProgress, LinearProgress, ListItem, SubscriptionCard } from "../components/seen/display";
import { BottomNav } from "../components/seen/BottomNav";
import { PlaybackProvider, usePlayback, formatTime } from "../playback/PlaybackProvider";
import { ExpandedPlayer } from "../components/seen/MediaPlayerBar";

describe("form atoms", () => {
  it("TextField links its label and error for assistive tech", () => {
    render(<TextField label="Email" error="Enter a valid email" value="" onChange={() => {}} />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a valid email");
  });

  it("PasswordField reveals and hides the password", async () => {
    render(<PasswordField label="Password" value="Secret123" onChange={() => {}} />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: /show password/i }));
    expect(input).toHaveAttribute("type", "text");
    await userEvent.click(screen.getByRole("button", { name: /hide password/i }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("SearchBar clears with the clear button and Escape", async () => {
    function Harness() {
      const [q, setQ] = useState("");
      return <SearchBar label="Search stories" value={q} onChange={setQ} />;
    }
    render(<Harness />);
    const input = screen.getByRole("searchbox", { name: /search stories/i });
    await userEvent.type(input, "memory");
    await userEvent.click(screen.getByRole("button", { name: /clear search/i }));
    expect(input).toHaveValue("");
    await userEvent.type(input, "abc{Escape}");
    expect(input).toHaveValue("");
  });

  it("Toggle is a switch that reports its state", async () => {
    const onChange = vi.fn();
    render(<Toggle label="High contrast" checked={false} onChange={onChange} />);
    const sw = screen.getByRole("switch", { name: /high contrast/i });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("Checkbox supports checked, indeterminate and disabled", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox label="Step" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Step" }));
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Checkbox label="Step" checked="indeterminate" onChange={onChange} />);
    expect(screen.getByRole("checkbox", { name: "Step" })).toHaveAttribute("aria-checked", "mixed");
    rerender(<Checkbox label="Step" checked onChange={onChange} disabled />);
    expect(screen.getByRole("checkbox", { name: "Step" })).toBeDisabled();
  });

  it("RadioGroup selects one option inside a labelled group", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        label="Language"
        value="en"
        onChange={onChange}
        options={[
          { value: "en", label: "English" },
          { value: "fr", label: "Français" },
        ]}
      />,
    );
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "English" })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: "Français" }));
    expect(onChange).toHaveBeenCalledWith("fr");
  });
});

describe("surfaces", () => {
  it("ConfirmDialog confirms and cancels", async () => {
    const onConfirm = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(true);
      return <ConfirmDialog open={open} onOpenChange={setOpen} title="Remove?" description="Gone for good" confirmLabel="Remove" onConfirm={onConfirm} />;
    }
    render(<Harness />);
    expect(screen.getByRole("dialog", { name: "Remove?" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("Sheet and Drawer are labelled dialogs that close with Escape", async () => {
    function Harness({ kind }: { kind: "sheet" | "drawer" }) {
      const [open, setOpen] = useState(true);
      const P = kind === "sheet" ? Sheet : Drawer;
      return (
        <P open={open} onOpenChange={setOpen} title={`My ${kind}`}>
          <button>inside</button>
        </P>
      );
    }
    for (const kind of ["sheet", "drawer"] as const) {
      const { unmount } = render(<Harness kind={kind} />);
      expect(screen.getByRole("dialog", { name: `My ${kind}` })).toBeInTheDocument();
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      unmount();
    }
  });
});

describe("display organisms", () => {
  it("progress bars expose values", () => {
    render(
      <>
        <LinearProgress value={2} max={5} label="Checklist" />
        <CircularProgress value={45} label="Read" />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Checklist" })).toHaveAttribute("aria-valuenow", "2");
    expect(screen.getByRole("progressbar", { name: "Read" })).toHaveAttribute("aria-valuenow", "45");
  });

  it("ChapterRow renders each Figma state and blocks locked chapters", async () => {
    const onSelect = vi.fn();
    const states = ["available", "playing", "completed", "locked"] as const;
    render(
      <>
        {states.map((s, i) => (
          <ChapterRow key={s} index={i + 1} title={`Ch ${s}`} meta="5 min" state={s} onSelect={() => onSelect(s)} />
        ))}
      </>,
    );
    const rows = screen.getAllByTestId("chapter-row");
    expect(rows.map(r => r.getAttribute("data-state"))).toEqual([...states]);
    expect(rows[1]).toHaveAttribute("aria-current", "step");
    await userEvent.click(rows[3]);
    expect(onSelect).not.toHaveBeenCalled();
    await userEvent.click(rows[0]);
    expect(onSelect).toHaveBeenCalledWith("available");
  });

  it("ListItem and SubscriptionCard wire their actions", async () => {
    const onClick = vi.fn();
    const onAction = vi.fn();
    render(
      <>
        <ListItem label="Following" value="3" onClick={onClick} />
        <SubscriptionCard name="Kira Chen" price="$5.00" period="month" features={["All paid stories"]} current actionLabel="Cancel" onAction={onAction} />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: /following/i }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClick).toHaveBeenCalled();
    expect(onAction).toHaveBeenCalled();
    expect(screen.getByText("Current plan")).toBeInTheDocument();
  });

  it("BottomNav marks the active tab and ignores re-taps", async () => {
    const onNavigate = vi.fn();
    render(<BottomNav activeTab="library" onNavigate={onNavigate} />);
    expect(screen.getByRole("button", { name: "Library" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(screen.getByRole("button", { name: "Library" }));
    expect(onNavigate).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Explore" }));
    expect(onNavigate).toHaveBeenCalledWith("explore");
  });
});

describe("playback engine", () => {
  const track = { storyId: "s1", chapterId: "c1", title: "Chapter one", text: "one two three four five six", lang: "en" as const };

  function Loader({ withSrc = false }: { withSrc?: boolean }) {
    const p = usePlayback();
    return (
      <>
        <button onClick={() => p.load({ ...track, src: withSrc ? "/missing.mp3" : undefined })}>load</button>
        <span data-testid="status">{p.status}</span>
        <span data-testid="source">{p.source ?? "none"}</span>
        <ExpandedPlayer compact />
      </>
    );
  }

  it("says narration is unavailable instead of offering a dead play button", async () => {
    const saved = (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
    delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
    render(
      <PlaybackProvider>
        <Loader />
      </PlaybackProvider>,
    );
    await userEvent.click(screen.getByText("load"));
    expect(screen.getByTestId("status")).toHaveTextContent("unavailable");
    expect(screen.getByRole("button", { name: "Play" })).toBeDisabled();
    expect(screen.getByText(/narration isn't available/i)).toBeInTheDocument();
    if (saved) (window as unknown as { speechSynthesis?: unknown }).speechSynthesis = saved;
  });

  it("falls back to the device voice and labels it", async () => {
    const speak = vi.fn();
    Object.assign(window, {
      speechSynthesis: { speak, cancel: vi.fn(), pause: vi.fn(), resume: vi.fn(), paused: false, getVoices: () => [] },
      SpeechSynthesisUtterance: class {
        text: string;
        lang = "";
        constructor(t: string) {
          this.text = t;
        }
      },
    });
    render(
      <PlaybackProvider>
        <Loader />
      </PlaybackProvider>,
    );
    await userEvent.click(screen.getByText("load"));
    expect(screen.getByTestId("source")).toHaveTextContent("voice");
    expect(screen.getByText(/device's voice/i)).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Play" }));
    });
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0].text).toBe(track.text);
    expect(screen.getByTestId("status")).toHaveTextContent("playing");
  });

  it("formats times", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(75)).toBe("1:15");
    expect(formatTime(NaN)).toBe("0:00");
  });
});
