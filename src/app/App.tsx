import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { StoryStateProvider, useStoryState } from "./contexts/StoryStateContext";
import type { UserIntent, UserRole } from "./contexts/StoryStateContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { OnboardingSystem } from "./components/OnboardingSystem";
import { ForYouScreen } from "./components/ForYouScreen";
import { ExploreScreen, type ExploreTab } from "./components/ExploreScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { FeaturedStoryPreview } from "./components/FeaturedStoryPreview";
import { StoryChapterScreen } from "./components/StoryChapterScreen";
import { ChapterIndexScreen } from "./components/ChapterIndexScreen";
import { AboutScreen } from "./components/AboutScreen";
import { ProfilePreferencesScreen } from "./components/ProfilePreferencesScreen";
import { CreatorPublishFlow } from "./components/CreatorPublishFlow";
import { ModerationGovernanceSystem } from "./components/ModerationGovernanceSystem";
import { SearchScreen } from "./screens/SearchScreen";
import { CreatorMonetizationScreen } from "./components/CreatorMonetizationScreen";
import { CreatorEarningsScreen } from "./components/CreatorEarningsScreen";
import { SubscriptionManagementScreen } from "./components/SubscriptionManagementScreen";
import { AdminDashboardScreen } from "./components/AdminDashboardScreen";
import { CreatorProfileScreen } from "./screens/CreatorProfileScreen";
import { CollectionDetailScreen } from "./screens/CollectionDetailScreen";
import { CollectionsScreen } from "./screens/CollectionsScreen";
import { FundingScreen } from "./screens/FundingScreen";
import { OpportunityDetailScreen } from "./screens/OpportunityDetailScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { ScreenFrame } from "./screens/ScreenFrame";
import { StateTemplate } from "./components/seen/primitives";
import { AppNavProvider, type AppNav, type RouteParams } from "./navigation/AppNav";
import { type AppScreen, NOT_DEEP_LINKABLE, canAccess, fromHash, isScreen, toHash } from "./navigation/routes";
import { api } from "./services";
import { initializeDemoData } from "./data/demoData";

// Initialize demo data for testing (only runs once)
initializeDemoData();

type HistoryEntry = { screen: AppScreen; params: RouteParams };

function AppContent() {
  const { state, setLanguage, setIntent, setUserRole, enterStoryWorld } = useStoryState();
  const { state: authState } = useAuth();

  // Sync user role from auth state when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.role) {
      setUserRole(authState.user.role);
      if (authState.user.language) setLanguage(authState.user.language);
      if (authState.user.intent) setIntent(authState.user.intent);
    }
  }, [authState.isAuthenticated, authState.user?.role, authState.user?.language, authState.user?.intent, setUserRole, setLanguage, setIntent]);

  const hasCompletedOnboarding = localStorage.getItem("onboarding_completed") === "true";
  const hasEnteredSEEN = localStorage.getItem("hasEnteredSEEN") === "true";
  const savedStep = localStorage.getItem("onboarding_step");

  const [route, setRoute] = useState<HistoryEntry>({ screen: "onboarding", params: {} });
  const [isFirstVisit, setIsFirstVisit] = useState(!hasCompletedOnboarding);
  const currentScreen = route.screen;

  // ------------------------------------------------------------ navigation
  // Every navigation is mirrored into browser history (hash URLs), so the
  // browser/Android back button, refresh and shared links all work.
  const applyRoute = useCallback(
    (entry: HistoryEntry) => {
      if (entry.screen === "story-preview" && entry.params.id) enterStoryWorld(entry.params.id);
      setRoute(entry);
      window.scrollTo?.({ top: 0 });
    },
    [enterStoryWorld],
  );

  const go = useCallback(
    (screen: string, params: RouteParams = {}, opts: { replace?: boolean } = {}) => {
      if (!isScreen(screen)) return;
      const entry: HistoryEntry = { screen, params };
      const url = toHash(screen, params);
      if (opts.replace) window.history.replaceState(entry, "", url);
      else window.history.pushState(entry, "", url);
      applyRoute(entry);
    },
    [applyRoute],
  );

  const depth = useRef(0); // entries this session pushed onto browser history
  const back = useCallback(() => {
    // If we pushed history in this session, defer to the browser; otherwise
    // (deep link landed here) fall back to the home tab.
    if (window.history.state && window.history.length > 1 && depth.current > 0) window.history.back();
    else go("for-you", {}, { replace: true });
  }, [go]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      depth.current = Math.max(0, depth.current - 1);
      const entry = (e.state as HistoryEntry | null) ?? fromHash(window.location.hash);
      if (entry && isScreen(entry.screen) && entry.screen !== "onboarding") applyRoute(entry);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyRoute]);

  const trackedGo = useCallback(
    (screen: string, params?: RouteParams) => {
      depth.current += 1;
      go(screen, params);
    },
    [go],
  );

  // Leave onboarding once auth has resolved for a returning user; honour a deep link if present.
  useEffect(() => {
    if (!authState.isLoading && authState.isAuthenticated && hasCompletedOnboarding && currentScreen === "onboarding") {
      const linked = fromHash(window.location.hash);
      if (linked && !NOT_DEEP_LINKABLE.includes(linked.screen)) go(linked.screen, linked.params, { replace: true });
      else go("for-you", {}, { replace: true });
    }
  }, [authState.isLoading, authState.isAuthenticated, hasCompletedOnboarding, currentScreen, go]);

  // --------------------------------------------------------- unread badge
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const refresh = () => api.notifications.unreadCount().then(setUnreadCount, () => undefined);
    refresh();
    const onStore = (e: Event) => (e as CustomEvent).detail === "notifications" && refresh();
    window.addEventListener("seen:store", onStore);
    return () => window.removeEventListener("seen:store", onStore);
  }, []);

  const openStory = useCallback((id: string) => trackedGo("story-preview", { id }), [trackedGo]);

  const nav: AppNav = useMemo(
    () => ({
      go: trackedGo,
      back,
      openStory,
      openSearch: () => trackedGo("search"),
      openNotifications: () => trackedGo("notifications"),
      openProfile: () => trackedGo("profile"),
      unreadCount,
    }),
    [trackedGo, back, openStory, unreadCount],
  );

  // ---------------------------------------------------------- handlers
  const handleOnboardingComplete = (data: { role: UserRole; intent: UserIntent }) => {
    setUserRole(data.role);
    setIntent(data.intent);
    setIsFirstVisit(false);
    go("for-you", {}, { replace: true });
  };

  const handleNavigate = (screen: string) => {
    if (["for-you", "explore", "library", "profile"].includes(screen)) trackedGo(screen);
  };

  const role = state.userRole;
  const allowed = canAccess(currentScreen, role);

  return (
    <AppNavProvider value={nav}>
      <div className="size-full bg-black">
        <Toaster theme="dark" position="top-center" richColors closeButton />
        <AnimatePresence mode="wait">
          {currentScreen === "onboarding" && (
            <OnboardingSystem
              key="onboarding"
              onComplete={handleOnboardingComplete}
              initialStep={savedStep ? parseInt(savedStep) : 0}
              hasEnteredSEEN={hasEnteredSEEN}
            />
          )}

          {!allowed && (
            <ScreenFrame key="denied" title="Restricted" onBack={back}>
              <StateTemplate
                kind="denied"
                title="You don't have access to this area"
                message="This section is for a different account role. If you think you should have access, request it from Settings."
                actionLabel="Go back"
                onAction={back}
              />
            </ScreenFrame>
          )}

          {allowed && currentScreen === "story-preview" && state.currentStoryWorldId && (
            <FeaturedStoryPreview key="story-preview" onClose={back} onEnterStory={() => trackedGo("story-chapter")} />
          )}

          {allowed && currentScreen === "story-chapter" && state.currentStoryWorldId && (
            <StoryChapterScreen
              key="story-chapter"
              onClose={() => go("for-you")}
              onShowIndex={() => trackedGo("chapter-index")}
              storyWorldId={state.currentStoryWorldId}
            />
          )}

          {allowed && currentScreen === "chapter-index" && state.currentStoryWorldId && (
            <ChapterIndexScreen
              key="chapter-index"
              onClose={back}
              onSelectChapter={() => back()}
              storyWorldId={state.currentStoryWorldId}
            />
          )}

          {currentScreen === "for-you" && (
            <ForYouScreen
              key="for-you"
              onStoryClick={openStory}
              onNavigate={handleNavigate}
              onSearch={nav.openSearch}
              userIntent={state.intent}
              language={state.language}
              isFirstVisit={isFirstVisit}
            />
          )}

          {currentScreen === "explore" && (
            <ExploreScreen
              key={`explore-${route.params.tab ?? "stories"}`}
              onStoryClick={openStory}
              onNavigate={handleNavigate}
              onSearch={nav.openSearch}
              language={state.language}
              initialTab={(route.params.tab as ExploreTab) ?? "stories"}
            />
          )}

          {currentScreen === "library" && (
            <LibraryScreen key="library" onStoryClick={openStory} onNavigate={handleNavigate} onSearch={nav.openSearch} />
          )}

          {currentScreen === "profile" && (
            <ProfileScreen
              key="profile"
              onNavigate={handleNavigate}
              onSearch={nav.openSearch}
              onOpenSettings={() => trackedGo("settings")}
              onOpenAbout={() => trackedGo("about")}
              onOpenCreatorDashboard={() => trackedGo("creator-publish")}
              onOpenModeration={() => trackedGo("moderation-governance")}
              onOpenInstitutional={() => trackedGo("collections")}
              onOpenMonetization={() => trackedGo("creator-monetization")}
              onOpenEarnings={() => trackedGo("creator-earnings")}
              onOpenSubscriptions={() => trackedGo("subscription-management")}
              onOpenAdmin={() => trackedGo("admin-dashboard")}
              onOpenStory={openStory}
              userIntent={state.intent}
              language={state.language}
            />
          )}

          {currentScreen === "search" && <SearchScreen key="search" onClose={back} onSelectStory={id => go("story-preview", { id }, { replace: true })} />}
          {currentScreen === "notifications" && <NotificationsScreen key="notifications" />}
          {currentScreen === "creator-profile" && route.params.id && <CreatorProfileScreen key={`creator-${route.params.id}`} creatorId={route.params.id} />}
          {currentScreen === "collections" && <CollectionsScreen key="collections" />}
          {currentScreen === "collection-detail" && route.params.id && (
            <CollectionDetailScreen key={`collection-${route.params.id}`} collectionId={route.params.id} />
          )}
          {currentScreen === "funding" && <FundingScreen key="funding" />}
          {currentScreen === "opportunity" && route.params.id && <OpportunityDetailScreen key={`opp-${route.params.id}`} opportunityId={route.params.id} />}

          {allowed && currentScreen === "creator-monetization" && <CreatorMonetizationScreen key="creator-monetization" onClose={back} />}
          {allowed && currentScreen === "creator-earnings" && <CreatorEarningsScreen key="creator-earnings" onClose={back} />}
          {currentScreen === "subscription-management" && <SubscriptionManagementScreen key="subscription-management" onClose={back} />}
          {allowed && currentScreen === "admin-dashboard" && <AdminDashboardScreen key="admin-dashboard" onClose={back} />}
          {currentScreen === "about" && <AboutScreen key="about" onClose={back} />}
          {currentScreen === "settings" && <ProfilePreferencesScreen key="settings" onBack={back} />}

          {currentScreen === "creator-publish" && (
            <CreatorPublishFlow
              key="creator-publish"
              onClose={back}
              onViewStory={openStory}
              onGoToLibrary={() => trackedGo("library")}
              onViewEarnings={() => trackedGo("creator-earnings")}
            />
          )}

          {allowed && currentScreen === "moderation-governance" && <ModerationGovernanceSystem key="moderation-governance" onBack={back} />}
        </AnimatePresence>
      </div>
    </AppNavProvider>
  );
}

export default function App() {
  return (
    <StoryStateProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </StoryStateProvider>
  );
}
