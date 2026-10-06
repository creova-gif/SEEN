import { Flag } from "lucide-react";
import { reasonLabel, type ContentReport } from "../data/reportService";
import { Badge, Button, StateTemplate } from "./seen/primitives";

interface ReportsPanelProps {
  reports: ContentReport[];
  onResolve: (id: string, status: "action_taken" | "dismissed") => void;
}

const STATUS_LABEL = { open: "Open", action_taken: "Action taken", dismissed: "Dismissed" } as const;

/** Moderator view of reports on stories and creator profiles. Reporter identity is not shown. */
export function ReportsPanel({ reports, onResolve }: ReportsPanelProps) {
  if (reports.length === 0) {
    return (
      <div className="px-5 pt-6">
        <StateTemplate
          kind="empty"
          icon={<Flag className="w-5 h-5" aria-hidden />}
          title="No reports"
          message="Reports on stories and profiles appear here for review."
        />
      </div>
    );
  }
  return (
    <ul className="px-5 pt-5 space-y-3">
      {reports.map(r => (
        <li key={r.id} className="rounded-seen-md border border-seen-border bg-seen-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.14em] uppercase text-seen-muted">{r.targetType === "story" ? "Story" : "Creator profile"}</p>
              <p className="text-sm text-white mt-1 truncate">{r.targetTitle}</p>
            </div>
            <Badge tone={r.status === "open" ? "gold" : "surface"}>{STATUS_LABEL[r.status]}</Badge>
          </div>
          <p className="text-sm text-white/80 mt-3">{reasonLabel(r.reason)}</p>
          {r.details && <p className="text-sm text-seen-secondary mt-1 break-words">{r.details}</p>}
          <p className="text-xs text-seen-muted mt-2">{new Date(r.createdAt).toLocaleString()}</p>
          {r.status === "open" && (
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="secondary" onClick={() => onResolve(r.id, "dismissed")}>
                Dismiss
              </Button>
              <Button size="sm" onClick={() => onResolve(r.id, "action_taken")}>
                Mark action taken
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
