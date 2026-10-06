import { Compass, Home, Library, User } from "lucide-react";

/**
 * The single bottom navigation (Figma 298:82, Active=ForYou/Explore/Library/Profile).
 * Replaces three per-screen copies.
 */
export type TabId = "for-you" | "explore" | "library" | "profile";

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "for-you", label: "For You", Icon: Home },
  { id: "explore", label: "Explore", Icon: Compass },
  { id: "library", label: "Library", Icon: Library },
  { id: "profile", label: "Profile", Icon: User },
];

export function BottomNav({ activeTab, onNavigate }: { activeTab: TabId; onNavigate: (tab: TabId) => void }) {
  return (
    <nav aria-label="Main" className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-seen-surface/95 border-t border-seen-border pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-[428px] mx-auto flex">
        {TABS.map(({ id, label, Icon }) => {
          const active = id === activeTab;
          return (
            <button
              key={id}
              type="button"
              onClick={() => !active && onNavigate(id)}
              aria-current={active ? "page" : undefined}
              className={`flex-1 min-w-0 h-[calc(var(--seen-nav-height)-1px)] flex flex-col items-center justify-center gap-1 transition-colors duration-[var(--seen-duration-fast)] group ${
                active ? "text-white" : "text-white/55 hover:text-white/80"
              }`}
            >
              <Icon
                aria-hidden
                className="w-5 h-5"
                strokeWidth={active ? 2 : 1.5}
              />
              <span className="text-[11px] leading-[1.2] tracking-[0.02em] uppercase font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
