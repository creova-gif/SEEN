import { useState } from "react";
import { toast } from "sonner";
import { MessageSquareText, Trash2, UserX } from "lucide-react";
import { api, type Note } from "../services";
import { useResource } from "../hooks/useResource";
import { ResourceView } from "../components/seen/ResourceView";
import { Button, StateTemplate } from "../components/seen/primitives";
import { ConfirmDialog } from "../components/seen/overlays";
import { useAppNav } from "../navigation/AppNav";
import { track } from "../observability";
import { ScreenFrame } from "./ScreenFrame";

/**
 * Creator inbox for private notes (E1). One-way: there is no reply, no public count,
 * and a reader is shown by name only if they chose to be.
 */
export function NotesScreen() {
  const nav = useAppNav();
  const notes = useResource(() => api.notes.received(), []);
  const [pending, setPending] = useState<Note | null>(null);
  const [blocking, setBlocking] = useState<Note | null>(null);

  const blockSender = async () => {
    const target = blocking;
    if (!target) return;
    setBlocking(null);
    try {
      await api.notes.blockSender(target.id);
      toast.success("Blocked. They can't send you new notes. Undo in Account and privacy.");
    } catch {
      toast.error("Couldn't block this person. Try again.");
    }
  };

  const remove = async () => {
    const target = pending;
    if (!target) return;
    setPending(null);
    const previous = notes.data;
    notes.mutate(list => (list ?? []).filter(n => n.id !== target.id));
    try {
      await api.notes.remove(target.id);
      track("note_deleted");
    } catch {
      notes.mutate(() => previous ?? []);
      toast.error("Couldn't delete the note. Try again.");
    }
  };

  return (
    <ScreenFrame title="Notes" onBack={nav.back}>
      <p className="text-sm text-seen-secondary mb-5">Private notes from people who read your stories. Only you can see them.</p>
      <ResourceView
        resource={notes}
        what="notes"
        isEmpty={d => d.length === 0}
        empty={
          <StateTemplate
            kind="empty"
            icon={<MessageSquareText className="w-5 h-5" aria-hidden />}
            title="No notes yet"
            message="When someone writes to you, it appears here."
          />
        }
      >
        {list => (
          <ul className="space-y-3">
            {list.map(n => (
              <li key={n.id} className="rounded-seen-md border border-seen-border bg-seen-surface p-4">
                <p className="text-xs tracking-[0.14em] uppercase text-seen-muted">{n.senderName ?? "Someone who read your story"}</p>
                <p className="text-sm text-white mt-2 whitespace-pre-wrap break-words">{n.body}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-seen-muted">{new Date(n.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setBlocking(n)} aria-label="Block sender">
                      <UserX className="w-4 h-4" aria-hidden /> Block
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setPending(n)} aria-label="Delete note">
                      <Trash2 className="w-4 h-4" aria-hidden /> Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ResourceView>
      <ConfirmDialog
        open={blocking !== null}
        onOpenChange={o => !o && setBlocking(null)}
        title="Block this sender?"
        description="You won't see who they are. They can't send you new notes, and earlier notes stay. You can undo this in Account and privacy."
        confirmLabel="Block sender"
        destructive
        onConfirm={blockSender}
      />
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={o => !o && setPending(null)}
        title="Delete this note?"
        description="This can't be undone."
        confirmLabel="Delete note"
        destructive
        onConfirm={remove}
      />
    </ScreenFrame>
  );
}
