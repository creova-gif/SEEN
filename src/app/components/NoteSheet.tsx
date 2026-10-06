import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, MAX_NOTE_LENGTH, ServiceError } from "../services";
import { Button } from "./seen/primitives";
import { Toggle } from "./seen/forms";
import { Sheet } from "./seen/overlays";
import { track } from "../observability";

interface NoteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storyId: string;
  storyTitle: string;
}

/**
 * A private one-way note to a story's creator (E1). Never shown publicly, no counts.
 * The body mounts only while open so each opening starts fresh.
 */
export function NoteSheet(props: NoteSheetProps) {
  return props.open ? <NoteSheetBody {...props} /> : null;
}

function messageFor(e: unknown): string {
  if (e instanceof ServiceError) {
    if (e.code === "forbidden") return "Sign in to send a note.";
    if (e.code === "rate_limited") return "You already sent a note on this story. Try again in an hour.";
    if (e.code === "invalid") return "Notes are 1 to 500 characters.";
  }
  return "Couldn't send your note. Try again.";
}

function NoteSheetBody({ onOpenChange, storyId, storyTitle }: NoteSheetProps) {
  const [body, setBody] = useState("");
  const [named, setNamed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const send = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.notes.send(storyId, body, { named });
      track("note_sent", { attributed: named });
      setSent(true);
    } catch (e) {
      const msg = messageFor(e);
      setError(msg);
      if (msg.startsWith("Couldn't")) toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet
      open
      onOpenChange={onOpenChange}
      title={sent ? "Note sent" : "Write a private note"}
      description={sent ? undefined : `To the creator of ${storyTitle}. Only they can read it. It is never shown publicly.`}
      footer={
        sent ? (
          <Button fullWidth onClick={() => onOpenChange(false)}>Done</Button>
        ) : (
          <Button fullWidth loading={busy} disabled={!body.trim() || busy} onClick={send}>Send note</Button>
        )
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-3 py-4" role="status">
          <CheckCircle2 className="w-8 h-8 text-seen-success" aria-hidden />
          <p className="text-sm text-white/80">Thank you. The creator will see your note.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="note-body" className="block text-xs tracking-[0.14em] uppercase text-seen-muted mb-2">Your note</label>
            <textarea
              id="note-body"
              value={body}
              maxLength={MAX_NOTE_LENGTH}
              onChange={e => setBody(e.target.value)}
              rows={5}
              className="w-full rounded-seen-md border border-seen-border bg-seen-surface px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              placeholder="What did this story bring up for you?"
            />
            <p className="text-xs text-seen-muted mt-1 text-right" aria-live="polite">{body.length} / {MAX_NOTE_LENGTH}</p>
          </div>
          <Toggle checked={named} onChange={setNamed} label="Include my name" description="Off by default. The creator sees “Someone who read your story”." />
          {error && <p role="alert" className="text-sm text-seen-error">{error}</p>}
        </div>
      )}
    </Sheet>
  );
}
