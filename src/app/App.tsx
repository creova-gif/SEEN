import { useState, useEffect } from "react";
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
import { AboutScreen } from "./components/AboutScreen";
import { ProfilePreferencesScreen } from "./components/ProfilePreferencesScreen";
import { StoryBuilderScreen } from "./components/StoryBuilderScreen";
import { ModerationGovernanceSystem } from "./components/ModerationGovernanceSystem";
import { InstitutionalCollectionScreen } from "./components/InstitutionalCollectionScreen";
import { useStoryState } from "./contexts/StoryStateContext";
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
  | "story-builder"
  | "moderation-governance"
  | "institutional-collection";

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
            language={state.language}
          />
        )}

        {currentScreen === "library" && (
          <LibraryScreen 
            key="library"
            onStoryClick={handleStoryClick}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === "profile" && (
          <ProfileScreen 
            key="profile"
            onNavigate={handleNavigate}
            onOpenSettings={() => setCurrentScreen("settings")}
            onOpenAbout={() => setCurrentScreen("about")}
            onOpenCreatorDashboard={() => setCurrentScreen("story-builder")}
            onOpenModeration={() => setCurrentScreen("moderation-governance")}
            onOpenInstitutional={() => setCurrentScreen("institutional-collection")}
            userIntent={state.intent}
            language={state.language}
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
            onBack={() => setCurrentScreen("profile")}
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