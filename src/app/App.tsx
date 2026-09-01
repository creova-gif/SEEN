import { useState, useEffect } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
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
import { SearchScreen } from "./components/SearchScreen";
import { NotificationsScreen } from "./components/NotificationsScreen";
import { EditProfileScreen } from "./components/EditProfileScreen";
import { ChangePasswordScreen } from "./components/ChangePasswordScreen";
import { EmailVerificationScreen } from "./components/EmailVerificationScreen";
import { TermsPrivacyScreen } from "./components/TermsPrivacyScreen";
import { NotificationSettingsScreen } from "./components/NotificationSettingsScreen";
import { ReportContentScreen } from "./components/ReportContentScreen";
import { StoryCompletionScreen } from "./components/StoryCompletionScreen";
import { AppUpdateModal } from "./components/AppUpdateModal";
import { OfflineBanner } from "./components/OfflineBanner";
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
  | "institutional-collection"
  | "search"
  | "notifications"
  | "edit-profile"
  | "change-password"
  | "email-verification"
  | "terms-privacy"
  | "notification-settings"
  | "report-content"
  | "story-completion";

function AppContent() {
  const { state, setLanguage, setIntent, setUserRole, setAccessibilityPreferences, setPersonalizationPreferences, enterStoryWorld } = useStoryState();
  const { state: authState } = useAuth();
  
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      const savedRole = localStorage.getItem('seen_user_role');
      if (savedRole && ['viewer', 'creator', 'moderator', 'admin'].includes(savedRole)) {
        setUserRole(savedRole as UserRole);
      }
    }
  }, [authState.isAuthenticated, authState.isLoading, setUserRole]);

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
  const [searchOrigin, setSearchOrigin] = useState<AppScreen>("for-you");
  const [termsPrivacyOrigin, setTermsPrivacyOrigin] = useState<AppScreen>("about");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // getInitialScreen() runs before AuthContext's async session check resolves, so
  // authState.isAuthenticated is always false at that point and a returning user
  // with a valid session lands on onboarding. Once the session check finishes,
  // correct course if we're still sitting on onboarding.
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
      case "search":
        setSearchOrigin(currentScreen);
        setCurrentScreen("search");
        break;
      case "notifications":
        setCurrentScreen("notifications");
        break;
      case "edit-profile":
        setCurrentScreen("edit-profile");
        break;
      case "change-password":
        setCurrentScreen("change-password");
        break;
      case "onboarding":
        setCurrentScreen("onboarding");
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
            onReport={() => setCurrentScreen("report-content")}
          />
        )}

        {currentScreen === "story-chapter" && state.currentStoryWorldId && (
          <StoryChapterScreen
            key="story-chapter"
            onClose={() => setCurrentScreen("for-you")}
            onShowIndex={() => setCurrentScreen("chapter-index")}
            onFinishStory={() => setCurrentScreen("story-completion")}
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
            onClose={() => setCurrentScreen("profile")}
            onOpenTermsPrivacy={() => {
              setTermsPrivacyOrigin("about");
              setCurrentScreen("terms-privacy");
            }}
          />
        )}

        {currentScreen === "settings" && (
          <ProfilePreferencesScreen
            key="settings"
            onBack={() => setCurrentScreen("profile")}
            onOpenChangePassword={() => setCurrentScreen("change-password")}
            onOpenTermsPrivacy={() => {
              setTermsPrivacyOrigin("settings");
              setCurrentScreen("terms-privacy");
            }}
            onOpenEmailVerification={() => setCurrentScreen("email-verification")}
            onCheckForUpdates={() => setShowUpdateModal(true)}
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
            onClose={() => setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "search" && (
          <SearchScreen
            key="search"
            onBack={() => setCurrentScreen(searchOrigin)}
            onStoryClick={handleStoryClick}
          />
        )}

        {currentScreen === "notifications" && (
          <NotificationsScreen
            key="notifications"
            onBack={() => setCurrentScreen("profile")}
            onOpenSettings={() => setCurrentScreen("notification-settings")}
          />
        )}

        {currentScreen === "edit-profile" && (
          <EditProfileScreen
            key="edit-profile"
            onBack={() => setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "change-password" && (
          <ChangePasswordScreen
            key="change-password"
            onBack={() => setCurrentScreen("settings")}
          />
        )}

        {currentScreen === "email-verification" && (
          <EmailVerificationScreen
            key="email-verification"
            onBack={() => setCurrentScreen("settings")}
          />
        )}

        {currentScreen === "terms-privacy" && (
          <TermsPrivacyScreen
            key="terms-privacy"
            onBack={() => setCurrentScreen(termsPrivacyOrigin)}
          />
        )}

        {currentScreen === "notification-settings" && (
          <NotificationSettingsScreen
            key="notification-settings"
            onBack={() => setCurrentScreen("notifications")}
          />
        )}

        {currentScreen === "report-content" && state.currentStoryWorldId && (
          <ReportContentScreen
            key="report-content"
            contentId={state.currentStoryWorldId}
            onBack={() => setCurrentScreen("story-preview")}
          />
        )}

        {currentScreen === "story-completion" && state.currentStoryWorldId && (
          <StoryCompletionScreen
            key="story-completion"
            storyWorldId={state.currentStoryWorldId}
            onBack={() => setCurrentScreen("story-chapter")}
            onBackToLibrary={() => setCurrentScreen("library")}
            onExploreMore={() => setCurrentScreen("explore")}
          />
        )}
      </AnimatePresence>

      <OfflineBanner className="fixed inset-x-0 top-0 z-[60]" />
      <AppUpdateModal isOpen={showUpdateModal} onDismiss={() => setShowUpdateModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoryStateProvider>
        <AuthProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </AuthProvider>
      </StoryStateProvider>
    </MotionConfig>
  );
}
