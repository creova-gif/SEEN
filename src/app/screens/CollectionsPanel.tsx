import { useState } from "react";
import { api, type CollectionKind } from "../services";
import { useResource } from "../hooks/useResource";
import { CollectionCard } from "../components/seen/cards";
import { ResourceView } from "../components/seen/ResourceView";
import { Chip, Skeleton, StateTemplate } from "../components/seen/primitives";
import { useAppNav } from "../navigation/AppNav";
import { useStoryState } from "../contexts/StoryStateContext";

/** Explore → Collections tab, also the body of the standalone Collections screen. */
export function CollectionsPanel({ initialKind }: { initialKind?: CollectionKind }) {
  const nav = useAppNav();
  const { state } = useStoryState();
  const [kind, setKind] = useState<CollectionKind | undefined>(initialKind);
  const resource = useResource(() => Promise.all([api.collections.list(kind), api.collections.listSaved()]), [kind]);

  return (
    <div>
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide -mx-5 px-5" role="group" aria-label="Filter collections">
        <Chip selected={!kind} onClick={() => setKind(undefined)}>All</Chip>
        <Chip selected={kind === "thematic"} onClick={() => setKind("thematic")}>Thematic</Chip>
        <Chip selected={kind === "institutional"} onClick={() => setKind("institutional")}>Institutional</Chip>
      </div>
      <ResourceView
        resource={resource}
        what="collections"
        isEmpty={([list]) => list.length === 0}
        empty={<StateTemplate kind="empty" title="No collections here yet" message="Try a different filter, or check back as curators add new selections." />}
        skeleton={
          <div className="space-y-4" aria-busy>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} kind="block" className="h-56" />
            ))}
          </div>
        }
      >
        {([collections, saved]) => (
          <ul className="grid grid-cols-1 gap-4" aria-label="Collections">
            {collections.map(c => (
              <li key={c.id}>
                <CollectionCard
                  collection={c}
                  language={state.language}
                  saved={saved.includes(c.id)}
                  onOpen={id => nav.go("collection-detail", { id })}
                />
              </li>
            ))}
          </ul>
        )}
      </ResourceView>
    </div>
  );
}
