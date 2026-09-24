import { useMemo, useState } from "react";
import { api, deadlineState, type ApplicationStatus, type OpportunityType } from "../services";
import { useResource } from "../hooks/useResource";
import { OpportunityCard } from "../components/seen/cards";
import { ResourceView } from "../components/seen/ResourceView";
import { Banner, Chip, SegmentedTabs, Skeleton, StateTemplate } from "../components/seen/primitives";
import { useAppNav } from "../navigation/AppNav";
import { ScreenFrame } from "./ScreenFrame";

type View = "open" | "mine" | "closed";
const TYPES: OpportunityType[] = ["grant", "residency", "commission", "fellowship"];

export function FundingScreen({ initialView = "open" }: { initialView?: View }) {
  const nav = useAppNav();
  const [view, setView] = useState<View>(initialView);
  const [type, setType] = useState<OpportunityType | null>(null);
  const resource = useResource(() => Promise.all([api.funding.list(), api.funding.listApplications()]));

  const statusOf = useMemo(() => {
    const map = new Map<string, ApplicationStatus>();
    resource.data?.[1].forEach(a => map.set(a.opportunityId, a.status));
    return (id: string) => map.get(id) ?? "none";
  }, [resource.data]);

  return (
    <ScreenFrame title="Funding" onBack={nav.back}>
      <p className="text-sm text-seen-secondary leading-relaxed mb-4">
        Grants, residencies and commissions for storytellers. Save an opportunity to track your application checklist.
      </p>
      <Banner tone="info" className="mb-5">
        These are demo listings for testing. Real calls for applications will be marked with their funder and a link to apply.
      </Banner>
      <SegmentedTabs<View>
        label="Funding views"
        value={view}
        onChange={setView}
        tabs={[
          { id: "open", label: "Open" },
          { id: "mine", label: "My tracker" },
          { id: "closed", label: "Closed" },
        ]}
      />
      <div className="flex gap-2 my-5 overflow-x-auto scrollbar-hide -mx-5 px-5" role="group" aria-label="Filter by type">
        <Chip selected={type === null} onClick={() => setType(null)}>All types</Chip>
        {TYPES.map(t => (
          <Chip key={t} selected={type === t} onClick={() => setType(type === t ? null : t)}>
            {t}
          </Chip>
        ))}
      </div>
      <ResourceView
        resource={resource}
        what="funding opportunities"
        skeleton={
          <div className="space-y-3" aria-busy>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} kind="block" className="h-40" />
            ))}
          </div>
        }
      >
        {([opps]) => {
          const list = opps
            .filter(o => !type || o.type === type)
            .filter(o => {
              const closed = deadlineState(o.deadline) === "closed";
              if (view === "closed") return closed;
              if (view === "mine") return statusOf(o.id) !== "none";
              return !closed;
            })
            .sort((a, b) => a.deadline.localeCompare(b.deadline));
          if (list.length === 0) {
            return view === "mine" ? (
              <StateTemplate
                kind="empty"
                title="Nothing tracked yet"
                message="Save an opportunity to keep its deadline and checklist here."
                actionLabel="Browse open funding"
                onAction={() => setView("open")}
              />
            ) : (
              <StateTemplate kind="empty" title="No matches" message="Nothing matches this filter right now. Try another type." actionLabel="Clear filter" onAction={() => setType(null)} />
            );
          }
          return (
            <ul className="space-y-3" aria-label="Funding opportunities">
              {list.map(o => (
                <li key={o.id}>
                  <OpportunityCard opportunity={o} status={statusOf(o.id)} onOpen={id => nav.go("opportunity", { id })} />
                </li>
              ))}
            </ul>
          );
        }}
      </ResourceView>
    </ScreenFrame>
  );
}
