import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import { StoryStateProvider } from "./contexts/StoryStateContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NavigationProvider } from "./navigation/NavigationController";
import { OnboardingSystem } from "./components/OnboardingSystem";
import { HomeScreen } from "./components/HomeScreen";
import { ForYouScreen } from "./components/ForYouScreen";
import { ExploreScreen } from "./components/ExploreScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { FeaturedStoryPreview } from "./components/FeaturedStoryPreview";
import { StoryChapterScreen } from "./components/StoryChapterScreen";
import { ChapterIndexScreen } from "./components/ChapterIndexScreen";
import { useStoryState } from "./contexts/StoryStateContext";

// Lazy-loaded: secondary surfaces not needed for first paint or the core
// reading loop. Each import().then(...) is needed because these components
// use named exports, not default exports. Group new screens into these (or
// new) chunks by surface area as they're added — see the beta build-out plan.
const AboutScreen = lazy(() => import("./components/AboutScreen").then(m => ({ default: m.AboutScreen })));
const ProfilePreferencesScreen = lazy(() => import("./components/ProfilePreferencesScreen").then(m => ({ default: m.ProfilePreferencesScreen })));
const SearchScreen = lazy(() => import("./screens/SearchScreen").then(m => ({ default: m.SearchScreen })));
const CreatorPublishFlow = lazy(() => import("./components/CreatorPublishFlow").then(m => ({ default: m.CreatorPublishFlow })));
const CreatorMonetizationScreen = lazy(() => import("./components/CreatorMonetizationScreen").then(m => ({ default: m.CreatorMonetizationScreen })));
const CreatorEarningsScreen = lazy(() => import("./components/CreatorEarningsScreen").then(m => ({ default: m.CreatorEarningsScreen })));
const SubscriptionManagementScreen = lazy(() => import("./components/SubscriptionManagementScreen").then(m => ({ default: m.SubscriptionManagementScreen })));
const ModerationGovernanceSystem = lazy(() => import("./components/ModerationGovernanceSystem").then(m => ({ default: m.ModerationGovernanceSystem })));
const AdminDashboardScreen = lazy(() => import("./components/AdminDashboardScreen").then(m => ({ default: m.AdminDashboardScreen })));
import type { Language, UserIntent, UserRole } from "./contexts/StoryStateContext";
import { initializeDemoData } from "./data/demoData";

// Initialize demo data for testing (only runs once)
initializeDemoData();

type AppScreen =
  | "onboarding"
  | "language-selection"
  | "splash"
  | "onboarding-purpose"
  | "onboarding-intent"
  | "onboarding-accessibility"
  | "home"
  | "for-you"
  | "explore"
  | "library"
  | "profile"
  | "story-preview"
  | "story-chapter"
  | "chapter-index"
  | "about"
  | "settings"
  | "creator-publish"
  | "moderation-governance"
  | "search"
  | "creator-monetization"
  | "creator-earnings"
  | "subscription-management"
  | "admin-dashboard";

function AppContent() {
  const { state, setLanguage, setIntent, setUserRole, setAccessibilityPreferences, setPersonalizationPreferences, enterStoryWorld } = useStoryState();
  const { state: authState } = useAuth();
  
  // Sync user role from auth state when user is authenticated
  // Use primitive values as dependencies to avoid infinite loops
  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.role) {
      setUserRole(authState.user.role);
      if (authState.user.language) {
        setLanguage(authState.user.language);
      }
      if (authState.user.intent) {
        setIntent(authState.user.intent);
      }
    }
  }, [
    authState.isAuthenticated, 
    authState.user?.role, 
    authState.user?.language, 
    authState.user?.intent,
    setUserRole,
    setLanguage,
    setIntent
  ]); // Include setter functions in dependencies
  
  // Check onboarding status from localStorage
  const hasCompletedOnboarding = localStorage.getItem("onboarding_completed") === "true";
  const hasEnteredSEEN = localStorage.getItem("hasEnteredSEEN") === "true";
  const savedStep = localStorage.getItem("onboarding_step");
  
  // Determine initial screen based on onboarding status and auth
  const getInitialScreen = (): AppScreen => {
    // If authenticated and onboarding complete, go to For You
    if (authState.isAuthenticated && hasCompletedOnboarding) {
      return "for-you";
    }
    // If authenticated but not completed onboarding, continue onboarding
    if (authState.isAuthenticated && (savedStep || hasEnteredSEEN)) {
      return "onboarding";
    }
    // If not authenticated, show onboarding (which includes account creation)
    if (!authState.isLoading) {
      return "onboarding";
    }
    // While checking auth, show onboarding
    return "onboarding";
  };
  
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(getInitialScreen());
  const [isFirstVisit, setIsFirstVisit] = useState(!hasCompletedOnboarding);

  // getInitialScreen() runs once on first render, before the async auth
  // session finishes loading (authState.isLoading starts true). Without this,
  // every returning authenticated user who already completed onboarding gets
  // stuck redoing it on every page load, because currentScreen never
  // re-syncs once auth resolves.
  useEffect(() => {
    if (
      !authState.isLoading &&
      authState.isAuthenticated &&
      hasCompletedOnboarding &&
      currentScreen === "onboarding"
    ) {
      setCurrentScreen("for-you");
    }
  }, [authState.isLoading, authState.isAuthenticated, hasCompletedOnboarding, currentScreen]);

  // Handle onboarding completion
  const handleOnboardingComplete = (data: { role: UserRole; intent: UserIntent }) => {
    setUserRole(data.role);
    setIntent(data.intent);
    setIsFirstVisit(false);
    setCurrentScreen("for-you");
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setCurrentScreen("splash");
  };

  const handleIntentSelect = (intent: UserIntent) => {
    setIntent(intent);
    setCurrentScreen("onboarding-accessibility");
  };

  const handleAccessibilityComplete = (prefs: { captionsEnabled: boolean; highContrast: boolean; reducedMotion: boolean }) => {
    setAccessibilityPreferences(prefs);
    setCurrentScreen("for-you"); // Navigate to For You after onboarding
  };

  const handleEnterStory = (storyWorldId: string) => {
    enterStoryWorld(storyWorldId);
    setCurrentScreen("story-preview");
  };

  // Handle story click with content ID
  const handleStoryClick = (contentId: string) => {
    enterStoryWorld(contentId);
    setCurrentScreen("story-preview");
  };

  // Handle search screen
  const handleOpenSearch = () => {
    setCurrentScreen("search");
  };

  const handleCloseSearch = () => {
    setCurrentScreen("for-you");
  };

  const handleSearchSelectStory = (storyId: string) => {
    enterStoryWorld(storyId);
    setCurrentScreen("story-preview");
  };

  // Navigation handler for bottom tabs
  const handleNavigate = (screen: string) => {
    switch (screen) {
      case "for-you":
        setCurrentScreen("for-you");
        break;
      case "explore":
        setCurrentScreen("explore");
        break;
      case "library":
        setCurrentScreen("library");
        break;
      case "profile":
        setCurrentScreen("profile");
        break;
      case "home":
        setCurrentScreen("home");
        break;
      default:
        break;
    }
  };

  return (
    <div className="size-full bg-black">
      <AnimatePresence mode="wait">
        {currentScreen === "onboarding" && (
          <OnboardingSystem 
            key="onboarding"
            onComplete={handleOnboardingComplete}
            initialStep={savedStep ? parseInt(savedStep) : 0}
            hasEnteredSEEN={hasEnteredSEEN}
          />
        )}

        {currentScreen === "home" && (
          <HomeScreen 
            key="home"
            onStoryClick={() => handleEnterStory("midnight-resonance")}
            userIntent={state.intent}
          />
        )}
        
        {currentScreen === "story-preview" && state.currentStoryWorldId && (
          <FeaturedStoryPreview 
            key="story-preview"
            onClose={() => setCurrentScreen("for-you")}
            onEnterStory={() => setCurrentScreen("story-chapter")}
          />
        )}

        {currentScreen === "story-chapter" && state.currentStoryWorldId && (
          <StoryChapterScreen 
            key="story-chapter"
            onClose={() => setCurrentScreen("for-you")}
            onShowIndex={() => setCurrentScreen("chapter-index")}
            storyWorldId={state.currentStoryWorldId}
          />
        )}

        {currentScreen === "chapter-index" && state.currentStoryWorldId && (
          <ChapterIndexScreen 
            key="chapter-index"
            onClose={() => setCurrentScreen("story-chapter")}
            onSelectChapter={(id) => {
              setCurrentScreen("story-chapter");
            }}
            storyWorldId={state.currentStoryWorldId}
          />
        )}

        {currentScreen === "for-you" && (
          <ForYouScreen
            key="for-you"
            onStoryClick={handleStoryClick}
            onNavigate={handleNavigate}
            onSearch={handleOpenSearch}
            userIntent={state.intent}
            language={state.language}
            isFirstVisit={isFirstVisit}
          />
        )}

        {currentScreen === "explore" && (
          <ExploreScreen
            key="explore"
            onStoryClick={handleStoryClick}
            onNavigate={handleNavigate}
            onSearch={handleOpenSearch}
            language={state.language}
          />
        )}

        {currentScreen === "library" && (
          <LibraryScreen
            key="library"
            onStoryClick={handleStoryClick}
            onNavigate={handleNavigate}
            onSearch={handleOpenSearch}
          />
        )}

        {currentScreen === "profile" && (
          <ProfileScreen
            key="profile"
            onNavigate={handleNavigate}
            onSearch={handleOpenSearch}
            onOpenSettings={() => setCurrentScreen("settings")}
            onOpenAbout={() => setCurrentScreen("about")}
            onOpenCreatorDashboard={() => setCurrentScreen("creator-publish")}
            onOpenModeration={() => setCurrentScreen("moderation-governance")}
            onOpenMonetization={() => setCurrentScreen("creator-monetization")}
            onOpenEarnings={() => setCurrentScreen("creator-earnings")}
            onOpenSubscriptions={() => setCurrentScreen("subscription-management")}
            onOpenAdmin={() => setCurrentScreen("admin-dashboard")}
            onOpenStory={handleStoryClick}
            userIntent={state.intent}
            language={state.language}
          />
        )}

        {currentScreen === "creator-monetization" && (
          <Suspense key="creator-monetization" fallback={null}>
            <CreatorMonetizationScreen onClose={() => setCurrentScreen("profile")} />
          </Suspense>
        )}

        {currentScreen === "creator-earnings" && (
          <Suspense key="creator-earnings" fallback={null}>
            <CreatorEarningsScreen onClose={() => setCurrentScreen("profile")} />
          </Suspense>
        )}

        {currentScreen === "subscription-management" && (
          <Suspense key="subscription-management" fallback={null}>
            <SubscriptionManagementScreen onClose={() => setCurrentScreen("profile")} />
          </Suspense>
        )}

        {currentScreen === "admin-dashboard" && (
          <Suspense key="admin-dashboard" fallback={null}>
            <AdminDashboardScreen onClose={() => setCurrentScreen("profile")} />
          </Suspense>
        )}

        {currentScreen === "about" && (
          <Suspense key="about" fallback={null}>
            <AboutScreen onClose={() => setCurrentScreen("profile")} />
          </Suspense>
        )}

        {currentScreen === "settings" && (
          <Suspense key="settings" fallback={null}>
            <ProfilePreferencesScreen onBack={() => setCurrentScreen("profile")} />
          </Suspense>
        )}

        {currentScreen === "creator-publish" && (
          <Suspense key="creator-publish" fallback={null}>
            <CreatorPublishFlow
              onClose={() => setCurrentScreen("profile")}
              onViewStory={storyId => {
                enterStoryWorld(storyId);
                setCurrentScreen("story-preview");
              }}
              onGoToLibrary={() => setCurrentScreen("library")}
              onViewEarnings={() => setCurrentScreen("creator-earnings")}
            />
          </Suspense>
        )}

        {currentScreen === "moderation-governance" && (
          <Suspense key="moderation-governance" fallback={null}>
            <ModerationGovernanceSystem onBack={() => setCurrentScreen("profile")} />
          </Suspense>
        )}

        {currentScreen === "search" && (
          <Suspense key="search" fallback={null}>
            <SearchScreen
              onClose={handleCloseSearch}
              onSelectStory={handleSearchSelectStory}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <StoryStateProvider>
      <AuthProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </AuthProvider>
    </StoryStateProvider>
  );
}