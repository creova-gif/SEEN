import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { StoryStateProvider } from "../contexts/StoryStateContext";
import { AppNavProvider, type AppNav } from "../navigation/AppNav";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { OpportunityDetailScreen } from "../screens/OpportunityDetailScreen";
import { CreatorsPanel } from "../screens/CreatorsPanel";
import { CreatorProfileScreen } from "../screens/CreatorProfileScreen";
import { SectionHeader } from "../components/SectionHeader";
import { setSimulation } from "../services/runtime";

function nav(overrides: Partial<AppNav> = {}): AppNav {
  return { go: vi.fn(), back: vi.fn(), openStory: vi.fn(), openSearch: vi.fn(), openNotifications: vi.fn(), openProfile: vi.fn(), unreadCount: 0, ...overrides };
}

function wrap(ui: ReactNode, n: AppNav = nav()) {
  return render(
    <StoryStateProvider>
      <AppNavProvider value={n}>{ui}</AppNavProvider>
    </StoryStateProvider>,
  );
}

describe("SectionHeader", () => {
  it("renders no dead 'See all' button without a handler", () => {
    render(<SectionHeader title="Featured" />);
    expect(screen.queryByRole("button", { name: /see all/i })).toBeNull();
  });
  it("wires 'See all' when a handler is given", async () => {
    const onViewAll = vi.fn();
    render(<SectionHeader title="Featured" onViewAll={onViewAll} />);
    await userEvent.click(screen.getByRole("button", { name: /see all featured/i }));
    expect(onViewAll).toHaveBeenCalled();
  });
});

describe("CreatorsPanel", () => {
  it("lists creators and opens a profile", async () => {
    const n = nav();
    wrap(<CreatorsPanel />, n);
    const cards = await screen.findAllByTestId("creator-card");
    expect(cards.length).toBeGreaterThan(3);
    await userEvent.click(cards[0]);
    expect(n.go).toHaveBeenCalledWith("creator-profile", expect.objectContaining({ id: expect.any(String) }));
  });

  it("shows a retryable error state and recovers", async () => {
    setSimulation("error");
    wrap(<CreatorsPanel />);
    const retry = await screen.findByRole("button", { name: /try again/i });
    expect(screen.getByRole("alert")).toHaveTextContent(/couldn't load creators/i);
    setSimulation("none");
    await userEvent.click(retry);
    expect(await screen.findAllByTestId("creator-card")).not.toHaveLength(0);
  });

  it("shows the offline state", async () => {
    setSimulation("offline");
    wrap(<CreatorsPanel />);
    expect(await screen.findByText(/you're offline/i)).toBeInTheDocument();
  });
});

describe("CreatorProfileScreen", () => {
  it("follows and unfollows", async () => {
    wrap(<CreatorProfileScreen creatorId="kira-chen" />);
    const follow = await screen.findByRole("button", { name: /^follow$/i });
    await userEvent.click(follow);
    await waitFor(() => expect(screen.getByRole("button", { name: /following/i })).toHaveAttribute("aria-pressed", "true"));
    expect(JSON.parse(localStorage.getItem("seen.v1.following")!)).toEqual(["kira-chen"]);
  });

  it("shows not-found for an unknown creator", async () => {
    wrap(<CreatorProfileScreen creatorId="nobody" />);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});

describe("OpportunityDetailScreen", () => {
  it("save → complete checklist → mark applied", async () => {
    wrap(<OpportunityDetailScreen opportunityId="opp-migration-stories-commission" />);
    await userEvent.click(await screen.findByRole("button", { name: /save & track/i }));
    const boxes = await screen.findAllByRole("checkbox");
    const applied = screen.getByRole("button", { name: /mark as applied/i });
    expect(applied).toBeDisabled();
    for (let i = 0; i < boxes.length; i++) {
      await userEvent.click(screen.getAllByRole("checkbox")[i]);
      await waitFor(() => expect(screen.getAllByRole("checkbox")[i]).toBeChecked());
    }
    await userEvent.click(screen.getByRole("button", { name: /mark as applied/i }));
    expect(await screen.findByText(/marked as applied\. we'll keep it/i)).toBeInTheDocument();
  });

  it("does not offer tracking on a closed call", async () => {
    wrap(<OpportunityDetailScreen opportunityId="opp-emerging-editor-fellowship" />);
    expect(await screen.findByText(/this call has closed/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /save & track/i })).toBeNull();
  });
});

describe("NotificationsScreen", () => {
  it("marks all as read and routes a funding notification to the opportunity", async () => {
    const n = nav();
    wrap(<NotificationsScreen />, n);
    const items = await screen.findAllByTestId("notification-item");
    expect(items.some(i => i.getAttribute("data-read") === "false")).toBe(true);
    await userEvent.click(screen.getByText(/funding closing soon/i));
    expect(n.go).toHaveBeenCalledWith("opportunity", { id: "opp-community-archive-microgrant" });
    await userEvent.click(screen.getByRole("button", { name: /mark all read/i }));
    await waitFor(() => screen.getAllByTestId("notification-item").forEach(i => expect(i).toHaveAttribute("data-read", "true")));
  });
});
