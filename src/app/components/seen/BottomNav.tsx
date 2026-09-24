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
    <nav aria-label="Main" className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-[428px] mx-auto px-3 flex justify-around">
        {TABS.map(({ id, label, Icon }) => {
          const active = id === activeTab;
          return (
            <button
              key={id}
              type="button"
              onClick={() => !active && onNavigate(id)}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1.5 min-w-16 min-h-14 py-2 transition-colors group ${
                active ? "text-white" : "text-white/55 hover:text-white/80"
              }`}
            >
              <Icon
                aria-hidden
                className={`w-5 h-5 transition-all ${active ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}`}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className={`text-[10px] tracking-widest uppercase ${active ? "font-medium" : "font-light"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
