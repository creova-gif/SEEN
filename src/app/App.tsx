import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { StoryStateProvider } from "./contexts/StoryStateContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NavigationProvider } from "./navigation/NavigationController";
import { OnboardingSystem } from "./components/OnboardingSystem";
import { HomeScreen } from "./components/HomeScreen";
import { ForYouScreen } from "./components/ForYouScreen";
import { ForYouScreenCreator } from "./components/ForYouScreenCreator";
import { ExploreScreen } from "./components/ExploreScreen";
import { ExploreScreenCreator } from "./components/ExploreScreenCreator";
import { LibraryScreen } from "./components/LibraryScreen";
import { LibraryScreenCreator } from "./components/LibraryScreenCreator";
import { ProfileScreen } from "./components/ProfileScreen";
import { ProfileScreenCreator } from "./components/ProfileScreenCreator";
import { ModeratorQueueScreen } from "./components/ModeratorQueueScreen";
import { FeaturedStoryPreview } from "./components/FeaturedStoryPreview";
import { StoryChapterScreen } from "./components/StoryChapterScreen";
import { ChapterIndexScreen } from "./components/ChapterIndexScreen";
import { AboutScreen } from "./components/AboutScreen";
import { ProfilePreferencesScreen } from "./components/ProfilePreferencesScreen";
import { StoryBuilderScreen } from "./components/StoryBuilderScreen";
import { ModerationGovernanceSystem } from "./components/ModerationGovernanceSystem";
import { InstitutionalCollectionScreen } from "./components/InstitutionalCollectionScreen";
import { useStoryState } from "./contexts/StoryStateContext";
import type { Language, UserIntent, UserRole } from "./contexts/StoryStateContext";
import { initializeDemoData } from "./data/demoData";

if (import.meta.env.DEV) {
  initializeDemoData();
}

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
  | "moderation-queue"
  | "story-preview"
  | "story-chapter"
  | "chapter-index"
  | "about"
  | "settings"
  | "story-builder"
  | "moderation-governance"
  | "institutional-collection";

function AppContent() {
  const { state, setLanguage, setIntent, setUserRole, setAccessibilityPreferences, setPersonalizationPreferences, enterStoryWorld } = useStoryState();
  const { state: authState } = useAuth();
  
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
  ]);
  
  const hasCompletedOnboarding = localStorage.getItem("onboarding_completed") === "true";
  const hasEnteredSEEN = localStorage.getItem("hasEnteredSEEN") === "true";
  const savedStep = localStorage.getItem("onboarding_step");
  
  const getInitialScreen = (): AppScreen => {
    if (authState.isAuthenticated && hasCompletedOnboarding) {
      return "for-you";
    }
    if (authState.isAuthenticated && (savedStep || hasEnteredSEEN)) {
      return "onboarding";
    }
    if (!authState.isLoading) {
      return "onboarding";
    }
    return "onboarding";
  };
  
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(getInitialScreen());
  const [isFirstVisit, setIsFirstVisit] = useState(!hasCompletedOnboarding);

  const handleOnboardingComplete = (data: { role: UserRole; intent: UserIntent }) => {
    setUserRole(data.role);
    setIntent(data.intent);
    setIsFirstVisit(false);
    setCurrentScreen("for-you");
  };

  const handleGuestPreview = () => {
    localStorage.setItem("guest_mode", "true");
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
    setCurrentScreen("for-you");
  };

  const handleEnterStory = (storyWorldId: string) => {
    enterStoryWorld(storyWorldId);
    setCurrentScreen("story-preview");
  };

  const handleStoryClick = (contentId: string) => {
    enterStoryWorld(contentId);
    setCurrentScreen("story-preview");
  };

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
      case "create":
        setCurrentScreen("story-builder");
        break;
      case "moderation-queue":
        setCurrentScreen("moderation-queue");
        break;
      default:
        break;
    }
  };

  const isCreator = state.userRole === "creator";
  const isModerator = state.userRole === "moderator" || state.userRole === "admin";
  const activeLanguage = (state.language as "en" | "fr" | "es") || "en";

  return (
    <div className="size-full bg-black">
      <AnimatePresence mode="wait">
        {currentScreen === "onboarding" && (
          <OnboardingSystem 
            key="onboarding"
            onComplete={handleOnboardingComplete}
            onGuestPreview={handleGuestPreview}
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
            onSelectChapter={(_id) => {
              setCurrentScreen("story-chapter");
            }}
            storyWorldId={state.currentStoryWorldId}
          />
        )}

        {currentScreen === "for-you" && isCreator && (
          <ForYouScreenCreator 
            key="for-you-creator"
            activeLanguage={activeLanguage}
            onNavigate={handleNavigate}
            onContentSelect={handleStoryClick}
          />
        )}

        {currentScreen === "for-you" && !isCreator && (
          <ForYouScreen 
            key="for-you"
            onStoryClick={handleStoryClick}
            onNavigate={handleNavigate}
            userIntent={state.intent}
            language={state.language}
            isFirstVisit={isFirstVisit}
          />
        )}

        {currentScreen === "explore" && isCreator && (
          <ExploreScreenCreator 
            key="explore-creator"
            activeLanguage={activeLanguage}
            onNavigate={handleNavigate}
            onContentSelect={handleStoryClick}
          />
        )}

        {currentScreen === "explore" && !isCreator && (
          <ExploreScreen 
            key="explore"
            onStoryClick={handleStoryClick}
            onNavigate={handleNavigate}
            language={state.language}
          />
        )}

        {currentScreen === "library" && isCreator && (
          <LibraryScreenCreator 
            key="library-creator"
            onNavigate={handleNavigate}
            onContentSelect={handleStoryClick}
          />
        )}

        {currentScreen === "library" && !isCreator && (
          <LibraryScreen 
            key="library"
            onStoryClick={handleStoryClick}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === "profile" && isCreator && (
          <ProfileScreenCreator
            key="profile-creator"
            onNavigate={handleNavigate}
            onOpenSettings={() => setCurrentScreen("settings")}
            onOpenAbout={() => setCurrentScreen("about")}
          />
        )}

        {currentScreen === "profile" && !isCreator && (
          <ProfileScreen 
            key="profile"
            onNavigate={handleNavigate}
            onOpenSettings={() => setCurrentScreen("settings")}
            onOpenAbout={() => setCurrentScreen("about")}
            onOpenCreatorDashboard={() => setCurrentScreen("story-builder")}
            onOpenModeration={() => setCurrentScreen("moderation-queue")}
            onOpenInstitutional={() => setCurrentScreen("institutional-collection")}
            userIntent={state.intent}
            language={state.language}
          />
        )}

        {currentScreen === "moderation-queue" && (
          <ModeratorQueueScreen
            key="moderation-queue"
            onNavigate={handleNavigate}
            isModerator={isModerator}
          />
        )}

        {currentScreen === "about" && (
          <AboutScreen 
            key="about"
            onBack={() => setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "settings" && (
          <ProfilePreferencesScreen 
            key="settings"
            onBack={() => setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "story-builder" && (
          <StoryBuilderScreen 
            key="story-builder"
            onClose={() => isCreator ? setCurrentScreen("for-you") : setCurrentScreen("profile")}
            onSave={() => isCreator ? setCurrentScreen("library") : setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "moderation-governance" && (
          <ModerationGovernanceSystem 
            key="moderation-governance"
            onBack={() => setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "institutional-collection" && (
          <InstitutionalCollectionScreen 
            key="institutional-collection"
            onBack={() => setCurrentScreen("profile")}
          />
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
