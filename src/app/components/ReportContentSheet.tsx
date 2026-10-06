import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, ServiceError } from "../services";
import {
  MAX_DETAILS,
  REPORT_REASONS,
  type ReportReason,
} from "../data/reportService";
import type { ReportTarget } from "../services";
import { Button } from "./seen/primitives";
import { RadioGroup } from "./seen/forms";
import { Sheet } from "./seen/overlays";

interface ReportContentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: ReportTarget;
  targetId: string;
  targetTitle: string;
}

/**
 * Report a story or creator. Ends on a confirmation; the reported person is never told who reported.
 * The body mounts only while open, so each opening starts with a fresh form.
 */
export function ReportContentSheet(props: ReportContentSheetProps) {
  return props.open ? <ReportSheetBody {...props} /> : null;
}

function ReportSheetBody({ open, onOpenChange, targetType, targetId, targetTitle }: ReportContentSheetProps) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const close = (next: boolean) => onOpenChange(next);

  const submit = async () => {
    if (!reason) return;
    setBusy(true);
    setError(null);
    try {
      await api.reports.submit({ targetType, targetId, targetTitle, reason, details });
      setSent(true);
    } catch (e) {
      if (e instanceof ServiceError && e.code === "conflict") setError(e.message);
      else if (e instanceof ServiceError && e.code === "forbidden") setError("Sign in to send a report.");
      else {
        setError("Couldn't send your report. Try again.");
        toast.error("Couldn't send your report. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const noun = targetType === "story" ? "story" : "profile";

  return (
    <Sheet
      open={open}
      onOpenChange={close}
      title={sent ? "Report sent" : `Report this ${noun}`}
      description={sent ? undefined : "Moderators review every report. The creator is not told who reported."}
      footer={
        sent ? (
          <Button fullWidth onClick={() => close(false)}>
            Done
          </Button>
        ) : (
          <Button fullWidth loading={busy} disabled={!reason || busy} onClick={submit}>
            Send report
          </Button>
        )
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-3 py-4" role="status">
          <CheckCircle2 className="w-8 h-8 text-seen-success" aria-hidden />
          <p className="text-sm text-white/80 max-w-[30ch]">Thank you. A moderator will review this {noun}. You can keep reading in the meantime.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <RadioGroup<ReportReason>
            label="Why are you reporting this?"
            value={reason as ReportReason}
            onChange={setReason}
            options={REPORT_REASONS.map(r => ({ value: r.value, label: r.label, description: r.description }))}
          />
          <div>
            <label htmlFor="report-details" className="block text-xs tracking-[0.14em] uppercase text-seen-muted mb-2">
              More detail (optional)
            </label>
            <textarea
              id="report-details"
              value={details}
              maxLength={MAX_DETAILS}
              onChange={e => setDetails(e.target.value)}
              rows={3}
              className="w-full rounded-seen-md border border-seen-border bg-seen-surface px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              placeholder="What should the moderator know?"
            />
            <p className="text-xs text-seen-muted mt-1 text-right" aria-live="polite">
              {details.length}/{MAX_DETAILS}
            </p>
          </div>
          {error && (
            <p role="alert" className="text-sm text-seen-error">
              {error}
            </p>
          )}
        </div>
      )}
    </Sheet>
  );
}
