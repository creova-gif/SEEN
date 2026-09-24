import { motion } from "motion/react";
import { Bell, Search, User } from "lucide-react";
import { useAppNav } from "../navigation/AppNav";
import { IconButton } from "./seen/primitives";

interface NavigationBarProps {
  /** Optional override; defaults to the app-level search. */
  onSearch?: () => void;
}

export function NavigationBar({ onSearch }: NavigationBarProps) {
  const nav = useAppNav();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-5 py-3 backdrop-blur-xl bg-black/60 border-b border-white/5"
    >
      <div className="max-w-[428px] mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg tracking-tight text-white">SEEN</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">by CREOVA</span>
        </div>

        <nav aria-label="Quick actions" className="flex items-center gap-2">
          <IconButton label="Search" onClick={onSearch ?? nav.openSearch}>
            <Search className="w-4 h-4 text-white/70" />
          </IconButton>
          <IconButton label="Notifications" badge={nav.unreadCount} onClick={nav.openNotifications}>
            <Bell className="w-4 h-4 text-white/70" />
          </IconButton>
          <IconButton label="Profile" onClick={nav.openProfile}>
            <User className="w-4 h-4 text-white/70" />
          </IconButton>
        </nav>
      </div>
    </motion.header>
  );
}
