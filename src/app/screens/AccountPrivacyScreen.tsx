import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Download, LogOut, ShieldCheck, Trash2, UserX } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services";
import { track } from "../observability";
import { useResource } from "../hooks/useResource";
import { ResourceView } from "../components/seen/ResourceView";
import { Button, SectionTitle, StateTemplate } from "../components/seen/primitives";
import { Toggle } from "../components/seen/forms";
import { ConfirmDialog } from "../components/seen/overlays";
import { ListItem } from "../components/seen/display";
import {
  buildAccountExport,
  deleteLocalAccount,
  loadNotificationPrefs,
  type NotificationPrefs,
} from "../data/accountData";
import { useAppNav } from "../navigation/AppNav";
import { ScreenFrame } from "./ScreenFrame";

/**
 * Account and privacy: what SEEN keeps, notification choices, blocked accounts,
 * export, sign out and delete. Added on top of Settings; nothing there changes.
 */
export function AccountPrivacyScreen() {
  const nav = useAppNav();
  const { state: auth, signOut } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadNotificationPrefs);
  const [confirm, setConfirm] = useState<"signout" | "delete" | null>(null);
  const user = auth.user;
  const blocked = useResource(() => api.blocks.list(), []);

  const unblock = async (id: string) => {
    const previous = blocked.data ?? [];
    blocked.mutate(list => (list ?? []).filter(x => x !== id));
    try {
      await api.blocks.unblock(id);
      toast.success("Unblocked");
    } catch {
      blocked.mutate(() => previous);
      toast.error("Couldn't unblock. Try again.");
    }
  };

  useEffect(() => {
    let live = true;
    api.preferences.get().then(p => live && setPrefs(p)).catch(() => {});
    return () => { live = false; };
  }, []);

  const setPref = async (key: keyof NotificationPrefs, value: boolean) => {
    const previous = prefs;
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      await api.preferences.set(next);
    } catch {
      setPrefs(previous);
      toast.error("Couldn't save that choice. Free some space on this device and try again.");
    }
  };

  const exportData = () => {
    try {
      const file = buildAccountExport(user);
      const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "seen-my-data.json";
      a.click();
      URL.revokeObjectURL(url);
      track("account_data_exported");
      toast.success("Your data was downloaded");
    } catch {
      toast.error("Couldn't prepare your data. Try again.");
    }
  };

  const doSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch {
      toast.error("Couldn't sign you out. Try again.");
    }
  };

  const doDelete = async () => {
    if (!user) return;
    try {
      track("account_deleted");
      deleteLocalAccount(user.id);
      await signOut();
      window.location.reload();
    } catch {
      toast.error("Couldn't delete the account. Nothing was removed. Try again.");
    }
  };

  return (
    <ScreenFrame title="Account and privacy" onBack={nav.back}>
      <section className="mb-10">
        <SectionTitle title="Privacy and security" />
        <div className="flex gap-3 rounded-seen-md border border-seen-border bg-seen-surface p-4">
          <ShieldCheck className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-xs text-seen-secondary leading-relaxed">
            Your account, saved stories and reading progress are stored on this device. SEEN does not show follower counts or like counts, and
            analytics record only anonymous event types, never your name or email.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle title="Notifications" subtitle="Saved on this device." />
        <div className="rounded-seen-md border border-seen-border bg-seen-surface px-4 divide-y divide-white/5">
          <div className="py-2">
            <Toggle checked={prefs.newStories} onChange={v => setPref("newStories", v)} label="New stories" description="From creators you follow." />
          </div>
          <div className="py-2">
            <Toggle checked={prefs.fundingDeadlines} onChange={v => setPref("fundingDeadlines", v)} label="Funding deadlines" description="For listings you track." />
          </div>
          <div className="py-2">
            <Toggle checked={prefs.replies} onChange={v => setPref("replies", v)} label="Replies" description="When someone answers your response." />
          </div>
        </div>
        <p className="flex items-center gap-2 text-xs text-seen-muted mt-2">
          <Bell className="w-3.5 h-3.5" aria-hidden /> Choices apply to the notifications list in this app.
        </p>
      </section>

      <section className="mb-10">
        <SectionTitle title="Blocked accounts" />
        <ResourceView
          resource={blocked}
          what="blocked accounts"
          isEmpty={d => d.length === 0}
          empty={
            <StateTemplate
              kind="empty"
              icon={<UserX className="w-5 h-5" aria-hidden />}
              title="No blocked accounts"
              message="People you block will appear here, and you can unblock them at any time."
            />
          }
        >
          {ids => (
            <ul className="space-y-2">
              {ids.map((id, i) => (
                <li key={id} className="flex items-center justify-between gap-3 rounded-seen-md border border-seen-border bg-seen-surface p-3 pl-4">
                  <span className="text-sm text-white">Blocked reader {i + 1}</span>
                  <Button size="sm" variant="secondary" onClick={() => unblock(id)}>Unblock</Button>
                </li>
              ))}
            </ul>
          )}
        </ResourceView>
      </section>

      <section className="mb-10">
        <SectionTitle title="Your data" />
        <div className="flex flex-col gap-3">
          <ListItem icon={<Download className="w-5 h-5" />} label="Download my data" description="A JSON file with your saved stories, progress and choices." onClick={exportData} />
          <ListItem icon={<LogOut className="w-5 h-5" />} label="Sign out" onClick={() => setConfirm("signout")} />
          <Button variant="destructive" icon={<Trash2 className="w-4 h-4" aria-hidden />} onClick={() => setConfirm("delete")} disabled={!user} className="w-full">
            Delete my account
          </Button>
          {!user && <p className="text-xs text-seen-muted">Sign in to manage your account.</p>}
        </div>
      </section>

      <ConfirmDialog
        open={confirm === "signout"}
        onOpenChange={o => !o && setConfirm(null)}
        title="Sign out of SEEN?"
        description="Your saved stories stay on this device. You can sign back in at any time."
        confirmLabel="Sign out"
        destructive={false}
        onConfirm={doSignOut}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        onOpenChange={o => !o && setConfirm(null)}
        title="Delete your account?"
        description="This removes your account and everything SEEN saved for you on this device. It can't be undone. Download your data first if you want a copy."
        confirmLabel="Delete account"
        onConfirm={doDelete}
      />
    </ScreenFrame>
  );
}
