import { useRef, useState } from "react";
import { track } from "../observability";
import { toast } from "sonner";
import { Check, ExternalLink, PartyPopper } from "lucide-react";
import { api, formatAmount, formatStatus, isApplyable, opportunityStatus, ServiceError, type ApplicationState } from "../services";
import { useResource } from "../hooks/useResource";
import { ResourceView } from "../components/seen/ResourceView";
import { Badge, Banner, Button, SectionTitle, SkeletonList } from "../components/seen/primitives";
import { SaveToggle } from "../components/seen/cards";
import { useAppNav } from "../navigation/AppNav";
import { ScreenFrame } from "./ScreenFrame";

const LANG_LABEL: Record<string, string> = { en: "English", fr: "French", es: "Spanish" };

export function OpportunityDetailScreen({ opportunityId }: { opportunityId: string }) {
  const nav = useAppNav();
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);
  const resource = useResource(
    async () => {
      const [opportunity, application] = await Promise.all([api.funding.get(opportunityId), api.funding.getApplication(opportunityId)]);
      return { opportunity, application };
    },
    [opportunityId],
  );

  // Optimistic: the checkbox/status changes the instant it's tapped, the save
  // happens in the background, and a failure rolls back with a toast.
  const update = async (patch: Partial<Pick<ApplicationState, "status" | "completedSteps">>, success?: string) => {
    const previous = resource.data?.application;
    if (previous) resource.mutate(prev => ({ ...prev!, application: { ...previous, ...patch } }));
    setBusy(true);
    const mine = ++seq.current;
    try {
      const application = await api.funding.updateApplication(opportunityId, patch);
      if (patch.status === "saved") track("funding_tracked", { opportunityId });
      if (patch.status === "applied") track("funding_marked_applied", { opportunityId });
      // Ignore responses superseded by a later tap.
      if (mine === seq.current) resource.mutate(prev => ({ ...prev!, application }));
      if (success) toast.success(success);
    } catch (e) {
      if (previous && mine === seq.current) resource.mutate(prev => ({ ...prev!, application: previous }));
      toast.error(e instanceof ServiceError && e.code === "invalid" ? e.message : "Couldn't save your progress. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenFrame title="Opportunity" onBack={nav.back}>
      <ResourceView resource={resource} what="opportunity" skeleton={<SkeletonList count={5} label="Loading opportunity" />}>
        {({ opportunity: o, application: app }) => {
          const status = opportunityStatus(o);
          const applyable = isApplyable(status);
          const tracked = app.status !== "none";
          const done = app.completedSteps.length;
          const allDone = done === o.steps.length;
          const toggleStep = (i: number) => {
            const steps = app.completedSteps.includes(i) ? app.completedSteps.filter(s => s !== i) : [...app.completedSteps, i];
            update({ completedSteps: steps, status: app.status === "applied" ? "applied" : "in-progress" });
          };
          return (
            <>
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="gold">{o.type}</Badge>
                <Badge>{o.region}</Badge>
                {o.isDemo && <Badge>Demo listing</Badge>}
                {app.status === "applied" && <Badge tone="mint">Applied</Badge>}
              </div>
              <h2 className="text-2xl font-light tracking-tight mt-4 leading-tight">{o.title}</h2>
              <p className="text-sm text-seen-secondary mt-1">{o.funder}</p>

              <dl className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-seen-md border border-seen-border bg-seen-surface p-4">
                  <dt className="text-[10px] tracking-[0.14em] uppercase text-seen-muted">Amount</dt>
                  <dd className="text-base text-seen-funding mt-1">{formatAmount(o)}</dd>
                </div>
                <div className="rounded-seen-md border border-seen-border bg-seen-surface p-4">
                  <dt className="text-[10px] tracking-[0.14em] uppercase text-seen-muted">Dates</dt>
                  <dd className={`text-base mt-1 ${applyable ? "text-white" : "text-seen-muted"}`}>{formatStatus(o)}</dd>
                </div>
              </dl>
              {o.deadlineNote && <p className="text-xs text-seen-secondary mt-3">{o.deadlineNote}</p>}
              {o.amountNote && o.amountMax != null && <p className="text-xs text-seen-secondary mt-1">{o.amountNote}</p>}

              <p className="text-sm text-white/80 leading-relaxed mt-6">{o.summary}</p>

              <a
                href={o.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 min-h-11 px-6 rounded-full bg-white text-black text-[13px] font-semibold uppercase tracking-[0.12em] hover:bg-white/90"
              >
                {applyable ? "Apply on funder's site" : "View on funder's site"}
                <ExternalLink className="w-4 h-4" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>

              <section className="mt-8">
                <SectionTitle title="Who can apply" />
                <ul className="space-y-2">
                  {o.eligibility.map(e => (
                    <li key={e} className="flex gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-seen-success flex-shrink-0 mt-0.5" aria-hidden />
                      {e}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-seen-muted mt-3">
                  Languages: {o.languages.map(l => LANG_LABEL[l] ?? l).join(", ")} · Disciplines: {o.disciplines.join(", ")}
                </p>
              </section>

              {!applyable && (
                <Banner tone="warning" className="mt-8">
                  Not open for applications right now{o.deadlineNote ? ` — ${o.deadlineNote}` : ""}. You can still save it and prepare your checklist.
                </Banner>
              )}
              <section className="mt-8">
                  <SectionTitle title="Your application" subtitle={tracked ? `${done} of ${o.steps.length} steps done` : "Save to start a checklist"} />
                  {!tracked ? (
                    <SaveToggle saved={false} busy={busy} label="Save & track" onToggle={() => update({ status: "saved" }, "Saved to your funding tracker")} />
                  ) : (
                    <>
                      <div
                        className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-4"
                        role="progressbar"
                        aria-label="Checklist progress"
                        aria-valuemin={0}
                        aria-valuemax={o.steps.length}
                        aria-valuenow={done}
                      >
                        <div className="h-full bg-seen-funding transition-all" style={{ width: `${(done / o.steps.length) * 100}%` }} />
                      </div>
                      <ul className="space-y-2">
                        {o.steps.map((s, i) => {
                          const checked = app.completedSteps.includes(i);
                          return (
                            <li key={s}>
                              <label className="flex items-center gap-3 min-h-11 px-4 rounded-seen-md border border-seen-border bg-seen-surface cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 accent-white"
                                  checked={checked}
                                  disabled={app.status === "applied"}
                                  onChange={() => toggleStep(i)}
                                />
                                <span className={`text-sm ${checked ? "text-white/50 line-through" : "text-white/85"}`}>{s}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                      {app.status === "applied" ? (
                        <div role="status" className="mt-6 flex items-center gap-3 rounded-seen-md border border-seen-success/30 bg-seen-success/10 p-4">
                          <PartyPopper className="w-5 h-5 text-seen-success" aria-hidden />
                          <p className="text-sm text-white/85">Marked as applied. We'll keep it in your tracker.</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3 mt-6">
                          <Button
                            disabled={!allDone || !applyable}
                            loading={busy}
                            onClick={() => update({ status: "applied" }, "Marked as applied — good luck!")}
                          >
                            Mark as applied
                          </Button>
                          <Button variant="ghost" disabled={busy} onClick={() => update({ status: "none", completedSteps: [] }, "Removed from your tracker")}>
                            Stop tracking
                          </Button>
                        </div>
                      )}
                      {app.status !== "applied" && (!allDone || !applyable) && (
                        <p className="text-xs text-seen-muted mt-3">
                          {applyable ? "Complete every step to mark this application as submitted." : "You can mark it as applied once the intake is open."}
                        </p>
                      )}
                    </>
                  )}
                </section>

              <footer className="mt-10 pt-4 border-t border-white/5 text-xs text-seen-muted leading-relaxed">
                Checked {new Date(o.verifiedAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })} against:{" "}
                {o.sourceUrls.map((u, i) => (
                  <span key={u}>
                    {i > 0 && ", "}
                    <a href={u} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                      {sourceLabel(u)}
                    </a>
                  </span>
                ))}
                . Details change — confirm with the funder before you apply.
              </footer>
            </>
          );
        }}
      </ResourceView>
    </ScreenFrame>
  );
}

/** "cmf-fmc.ca › program-deadlines" — distinguishes several sources on one site. */
function sourceLabel(url: string): string {
  const u = new URL(url);
  const last = u.pathname.split("/").filter(Boolean).pop()?.replace(/\.(pdf|html?)$/i, "");
  return last ? `${u.hostname.replace(/^www\./, "")} › ${last}` : u.hostname.replace(/^www\./, "");
}
