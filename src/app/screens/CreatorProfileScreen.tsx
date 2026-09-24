import { useState } from "react";
import { track } from "../observability";
import { toast } from "sonner";
import { UserCheck, UserPlus } from "lucide-react";
import { api } from "../services";
import { useResource } from "../hooks/useResource";
import { ResourceView } from "../components/seen/ResourceView";
import { Avatar, Badge, Button, SectionTitle, SkeletonList } from "../components/seen/primitives";
import { StoryRow } from "../components/seen/StoryRow";
import { useAppNav } from "../navigation/AppNav";
import { useStoryState } from "../contexts/StoryStateContext";
import { ScreenFrame } from "./ScreenFrame";

const LANG_LABEL: Record<string, string> = { en: "English", fr: "Français", es: "Español" };

export function CreatorProfileScreen({ creatorId }: { creatorId: string }) {
  const nav = useAppNav();
  const { state } = useStoryState();
  const resource = useResource(
    async () => {
      const [creator, following] = await Promise.all([api.creators.get(creatorId), api.creators.listFollowing()]);
      return { creator, following: following.includes(creatorId) };
    },
    [creatorId],
  );
  const [busy, setBusy] = useState(false);

  const toggleFollow = async () => {
    if (!resource.data) return;
    const next = !resource.data.following;
    setBusy(true);
    resource.mutate(prev => ({ ...prev!, following: next })); // optimistic
    try {
      await api.creators.setFollowing(creatorId, next);
      track(next ? "creator_followed" : "creator_unfollowed", { creatorId });
      toast.success(next ? `Following ${resource.data.creator.name}` : `Unfollowed ${resource.data.creator.name}`);
    } catch {
      resource.mutate(prev => ({ ...prev!, following: !next })); // roll back
      toast.error("Couldn't update follow. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenFrame title={resource.data?.creator.name ?? "Creator"} onBack={nav.back}>
      <ResourceView resource={resource} what="creator" skeleton={<SkeletonList count={4} label="Loading creator" />}>
        {({ creator, following }) => (
          <>
            <section className="flex flex-col items-center text-center pt-4 pb-8 border-b border-white/5">
              <Avatar name={creator.name} size="lg" />
              <h2 className="text-2xl font-light tracking-tight mt-4">{creator.name}</h2>
              <p className="text-sm text-seen-secondary mt-2 max-w-[320px] leading-relaxed">{creator.bio}</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {creator.languages.map(l => (
                  <Badge key={l}>{LANG_LABEL[l] ?? l}</Badge>
                ))}
              </div>
              <Button
                className="mt-6"
                variant={following ? "secondary" : "primary"}
                loading={busy}
                onClick={toggleFollow}
                aria-pressed={following}
                icon={following ? <UserCheck className="w-4 h-4" aria-hidden /> : <UserPlus className="w-4 h-4" aria-hidden />}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </section>

            <section className="pt-8">
              <SectionTitle title="Themes" />
              <div className="flex flex-wrap gap-2 mb-8">
                {creator.themes.map(t => (
                  <Badge key={t} tone="purple">
                    {t}
                  </Badge>
                ))}
              </div>
              <SectionTitle title="Stories" subtitle={`${creator.storyIds.length} published`} />
              <ul className="space-y-3">
                {creator.storyIds.map(id => (
                  <li key={id}>
                    <StoryRow storyId={id} language={state.language} onOpen={nav.openStory} />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </ResourceView>
    </ScreenFrame>
  );
}
