import { useMemo, useState } from "react";
import { api, isApplyable, opportunityStatus, type ApplicationStatus, type OpportunityType } from "../services";
import { useResource } from "../hooks/useResource";
import { OpportunityCard } from "../components/seen/cards";
import { ResourceView } from "../components/seen/ResourceView";
import { Banner, Button, Chip, SegmentedTabs, Skeleton, StateTemplate } from "../components/seen/primitives";
import { Drawer } from "../components/seen/overlays";
import { RadioGroup } from "../components/seen/forms";
import { SlidersHorizontal } from "lucide-react";
import { useAppNav } from "../navigation/AppNav";
import { ScreenFrame } from "./ScreenFrame";

type View = "open" | "upcoming" | "mine";
const ALL_TYPES: OpportunityType[] = ["grant", "fund", "lab", "pitch", "residency", "commission", "fellowship"];

export function FundingScreen({ initialView = "open" }: { initialView?: View }) {
  const nav = useAppNav();
  const [view, setView] = useState<View>(initialView);
  const [type, setType] = useState<OpportunityType | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resource = useResource(() => Promise.all([api.funding.list(), api.funding.listApplications()]));

  const regions = useMemo(() => [...new Set(resource.data?.[0].map(o => o.region) ?? [])].sort(), [resource.data]);
  const typesPresent = useMemo(() => new Set(resource.data?.[0].map(o => o.type) ?? []), [resource.data]);
  const TYPES = ALL_TYPES.filter(t => typesPresent.has(t));

  const statusOf = useMemo(() => {
    const map = new Map<string, ApplicationStatus>();
    resource.data?.[1].forEach(a => map.set(a.opportunityId, a.status));
    return (id: string) => map.get(id) ?? "none";
  }, [resource.data]);

  return (
    <ScreenFrame title="Funding" onBack={nav.back}>
      <p className="text-sm text-seen-secondary leading-relaxed mb-4">
        Real grants, funds and labs for Canadian storytellers. Save one to keep its deadline and your application checklist in one place.
      </p>
      <Banner tone="info" className="mb-5">
        Listings were checked against each funder's website on Sep 24, 2026. Programs change — always confirm details on the funder's site before applying.
      </Banner>
      <SegmentedTabs<View>
        label="Funding views"
        value={view}
        onChange={setView}
        tabs={[
          { id: "open", label: "Open now" },
          { id: "upcoming", label: "Coming up" },
          { id: "mine", label: "My tracker" },
        ]}
      />
      <div className="flex items-center gap-2 my-5 flex-wrap">
        <Button variant="secondary" size="sm" icon={<SlidersHorizontal className="w-3.5 h-3.5" aria-hidden />} onClick={() => setFiltersOpen(true)}>
          Filters{type || region ? ` · ${[type, region].filter(Boolean).length}` : ""}
        </Button>
        {type && (
          <Chip selected onClick={() => setType(null)} aria-label={`Remove type filter ${type}`}>
            {type} ✕
          </Chip>
        )}
        {region && (
          <Chip selected onClick={() => setRegion(null)} aria-label={`Remove region filter ${region}`}>
            {region} ✕
          </Chip>
        )}
      </div>
      <Drawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title="Filter funding"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { setType(null); setRegion(null); }}>
              Clear
            </Button>
            <Button fullWidth onClick={() => setFiltersOpen(false)}>
              Show results
            </Button>
          </div>
        }
      >
        <div className="space-y-8">
          <RadioGroup<string>
            label="Type"
            value={type ?? "all"}
            onChange={v => setType(v === "all" ? null : (v as OpportunityType))}
            options={[{ value: "all", label: "All types" }, ...TYPES.map(t => ({ value: t, label: t[0].toUpperCase() + t.slice(1) }))]}
          />
          <RadioGroup<string>
            label="Region"
            value={region ?? "all"}
            onChange={v => setRegion(v === "all" ? null : v)}
            options={[{ value: "all", label: "Anywhere" }, ...regions.map(r => ({ value: r, label: r }))]}
          />
        </div>
      </Drawer>
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
            .filter(o => !region || o.region === region)
            .filter(o => {
              const applyable = isApplyable(opportunityStatus(o));
              if (view === "mine") return statusOf(o.id) !== "none";
              if (view === "upcoming") return !applyable;
              return applyable;
            })
            // Fixed deadlines soonest first, then rolling / not-yet-dated programmes.
            .sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999") || a.title.localeCompare(b.title));
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
              <StateTemplate
                kind="empty"
                title="No matches"
                message={type || region ? "Nothing matches these filters in this list right now." : "Nothing here right now."}
                actionLabel={type || region ? "Clear filters" : undefined}
                onAction={type || region ? () => { setType(null); setRegion(null); } : undefined}
              />
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
