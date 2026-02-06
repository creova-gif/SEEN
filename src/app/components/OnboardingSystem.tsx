import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useStoryState } from "../contexts/StoryStateContext";
import type { UserRole, UserIntent, Language, PersonalizationPreferences } from "../contexts/StoryStateContext";
import { LanguageSelectionScreen } from "./LanguageSelectionScreen";
import { OnboardingPurpose } from "./OnboardingPurpose";
import { OnboardingAccessibility } from "./OnboardingAccessibility";

/**
 * ONBOARDING SYSTEM
 * SEEN by CREOVA
 * 
 * Integrated cinematic onboarding flow:
 * 0. Language Selection
 * 1. Invocation: Emotional entry
 * 2. Purpose: Cultural manifesto
 * 3. Role: Identity recognition
 * 4. Intent: Path selection
 * 5. Account: Identity creation
 * 6. Accessibility: Experience customization
 * 7. Presence: Identity formation
 * 8. Threshold: Final entry
 * 
 * Seamless transitions, no hard breaks, no progress indicators
 */

interface OnboardingSystemProps {
  onComplete: (data: {
    role: UserRole;
    intent: UserIntent;
  }) => void;
  initialStep?: number;
  hasEnteredSEEN?: boolean;
}

type OnboardingLayer = "language" | "invocation" | "orientation";
type OrientationStep = "purpose" | "role" | "intent" | "account" | "accessibility" | "presence" | "threshold";

export function OnboardingSystem({ 
  onComplete, 
  initialStep = 0,
  hasEnteredSEEN = false 
}: OnboardingSystemProps) {
  const { signUp, signIn, requestPasswordRecovery, state: authState } = useAuth();
  const { state, setLanguage, setPersonalizationPreferences } = useStoryState();
  
  // Determine initial layer based on whether language is set and user has entered
  const getInitialLayer = (): OnboardingLayer => {
    if (!state.language) return "language";
    if (!hasEnteredSEEN) return "invocation";
    return "orientation";
  };
  
  const [currentLayer, setCurrentLayer] = useState<OnboardingLayer>(getInitialLayer());
  const [currentStep, setCurrentStep] = useState<OrientationStep>("purpose");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<UserIntent | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Save progress to localStorage
  useEffect(() => {
    if (currentLayer === "orientation") {
      const stepIndex = ["purpose", "role", "intent", "account", "accessibility", "presence", "threshold"].indexOf(currentStep);
      localStorage.setItem("onboarding_step", stepIndex.toString());
    }
  }, [currentLayer, currentStep]);

  // Handle Language Selection
  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setCurrentLayer("invocation");
  };

  // Handle Layer 1 → Layer 2 transition (Invocation → Purpose)
  const handleInvocationComplete = () => {
    localStorage.setItem("hasEnteredSEEN", "true");
    setCurrentLayer("orientation");
    setCurrentStep("purpose");
  };

  // Handle Purpose → Role
  const handlePurposeNext = () => {
    setCurrentStep("role");
  };

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep("intent");
  };

  // Handle intent selection
  const handleIntentSelect = (intent: UserIntent) => {
    setSelectedIntent(intent);
    setCurrentStep("account");
  };

  // Handle account creation
  const handleAccountCreate = async (email: string, password: string, name: string) => {
    if (!selectedRole || !selectedIntent) return;
    
    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      await signUp(email, password, name, selectedRole, state.language, selectedIntent);
      setCurrentStep("accessibility");
    } catch (error) {
      console.error("Error creating account:", error);
      setAccountError(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Handle sign in (for existing accounts)
  const handleSignIn = async (email: string, password: string) => {
    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      await signIn(email, password);
      // After successful sign-in, the user data (including role and intent) is fetched automatically
      // Skip to accessibility step since account already exists
      setCurrentStep("accessibility");
    } catch (error) {
      console.error("Error signing in:", error);
      setAccountError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Handle password recovery
  const handlePasswordRecovery = async (email: string) => {
    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      await requestPasswordRecovery(email);
      return "Recovery link sent";
    } catch (error) {
      console.error("Error requesting password recovery:", error);
      setAccountError(error instanceof Error ? error.message : "Failed to request password recovery");
      return null;
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Handle accessibility preferences
  const handleAccessibilityComplete = (prefs: PersonalizationPreferences) => {
    setPersonalizationPreferences(prefs);
    setCurrentStep("presence");
  };

  // Handle presence → threshold
  const handlePresenceNext = () => {
    setCurrentStep("threshold");
  };

  // Handle complete onboarding
  const handleComplete = () => {
    if (selectedRole && selectedIntent) {
      localStorage.setItem("onboarding_completed", "true");
      localStorage.removeItem("onboarding_step");
      onComplete({
        role: selectedRole,
        intent: selectedIntent
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <AnimatePresence mode="wait">
        {/* Layer 0: Language Selection */}
        {currentLayer === "language" && (
          <LanguageSelectionScreen
            key="language"
            onSelectLanguage={handleLanguageSelect}
          />
        )}

        {/* Layer 1: Invocation */}
        {currentLayer === "invocation" && (
          <InvocationLayer 
            key="invocation"
            onComplete={handleInvocationComplete} 
          />
        )}

        {/* Layer 2: Orientation */}
        {currentLayer === "orientation" && (
          <>
            {currentStep === "purpose" && (
              <OnboardingPurpose
                key="purpose"
                onNext={handlePurposeNext}
              />
            )}
            {currentStep === "role" && (
              <RoleStep 
                key="role" 
                onSelect={handleRoleSelect} 
              />
            )}
            {currentStep === "intent" && (
              <IntentStep 
                key="intent" 
                onSelect={handleIntentSelect} 
              />
            )}
            {currentStep === "account" && (
              <AccountStep 
                key="account" 
                onComplete={handleAccountCreate}
                onSignIn={handleSignIn}
                onRecover={handlePasswordRecovery}
                isLoading={isCreatingAccount}
                error={accountError}
              />
            )}
            {currentStep === "accessibility" && (
              <OnboardingAccessibility
                key="accessibility"
                onComplete={handleAccessibilityComplete}
              />
            )}
            {currentStep === "presence" && (
              <PresenceStep 
                key="presence" 
                onNext={handlePresenceNext} 
              />
            )}
            {currentStep === "threshold" && (
              <ThresholdStep 
                key="threshold" 
                onEnter={handleComplete} 
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * LAYER 0: INVOCATION
 * The emotional entry point - first thing user sees
 * Simple, grounding, no choices
 */
function InvocationLayer({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Subtle animated background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ 
          opacity: [0.2, 0.3, 0.2],
          scale: [1.2, 1.3, 1.2],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl tracking-tight text-white mb-2">
            SEEN
          </h1>
          <p className="text-xs tracking-[0.4em] uppercase text-white/30">
            by CREOVA
          </p>
        </motion.div>

        {/* Poetic tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="text-base text-white/60 text-center leading-relaxed mb-16"
        >
          Where stories live,
          <br />
          where culture breathes
        </motion.p>

        {/* Primary invocation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2 }}
          className="text-lg text-white/80 text-center leading-relaxed mb-16"
        >
          You are entering SEEN.
        </motion.p>

        {/* Call to action */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="group relative px-10 py-3 text-sm font-bold tracking-[0.3em] uppercase text-white/95 transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
          }}
        >
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.3) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          
          {/* Subtle pulse animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(76, 175, 80, 0.4)',
                '0 0 0 8px rgba(76, 175, 80, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{ borderRadius: '2px' }}
          />
          
          {/* Button text with letter emphasis */}
          <span className="relative z-10 inline-flex items-center gap-[0.15em]">
            <span className="group-hover:text-white transition-colors duration-300">S</span>
            <span className="opacity-90 group-hover:opacity-100 group-hover:text-white transition-all duration-300">.</span>
            <span className="group-hover:text-white transition-colors duration-300">E</span>
            <span className="opacity-90 group-hover:opacity-100 group-hover:text-white transition-all duration-300">.</span>
            <span className="group-hover:text-white transition-colors duration-300">E</span>
            <span className="opacity-90 group-hover:opacity-100 group-hover:text-white transition-all duration-300">.</span>
            <span className="group-hover:text-white transition-colors duration-300">N</span>
          </span>
          
          {/* Focus indicator for accessibility */}
          <motion.div
            className="absolute inset-0 border-2 border-white/50 opacity-0 focus-visible:opacity-100 pointer-events-none"
            style={{ borderRadius: '2px' }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * LAYER 1: ORIENTATION STEPS
 * Assumes user has already "entered" - continuation, not restart
 */

// Step 1: Role Recognition
function RoleStep({ onSelect }: { onSelect: (role: UserRole) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md px-6"
    >
      <motion.h2 
        className="text-xl leading-relaxed text-white/80 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        How will you move through this space?
      </motion.h2>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <RoleButton
          label="Creator"
          subtitle="I make work"
          onClick={() => onSelect("creator")}
          delay={1.0}
        />
        <RoleButton
          label="Viewer"
          subtitle="I explore culture"
          onClick={() => onSelect("viewer")}
          delay={1.1}
        />
        <RoleButton
          label="Moderator"
          subtitle="I shape communities"
          onClick={() => onSelect("moderator")}
          delay={1.2}
        />
      </motion.div>
    </motion.div>
  );
}

function RoleButton({ 
  label, 
  subtitle, 
  onClick, 
  delay 
}: { 
  label: string; 
  subtitle: string; 
  onClick: () => void; 
  delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full py-5 text-left border-b border-white/10 hover:border-white/30 transition-all duration-500 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ x: 8 }}
    >
      <div className="text-base text-white/90 mb-1 group-hover:text-white transition-colors duration-500">
        {label}
      </div>
      <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors duration-500">
        {subtitle}
      </div>
    </motion.button>
  );
}

// Step 2: Intent Setting
function IntentStep({ onSelect }: { onSelect: (intent: UserIntent) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md px-6"
    >
      <motion.h2 
        className="text-xl leading-relaxed text-white/80 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        What brings you here?
      </motion.h2>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <IntentButton
          label="Share work"
          onClick={() => onSelect("create")}
          delay={1.0}
        />
        <IntentButton
          label="Build a body of work"
          onClick={() => onSelect("create")}
          delay={1.1}
        />
        <IntentButton
          label="Explore culture"
          onClick={() => onSelect("explore")}
          delay={1.2}
        />
        <IntentButton
          label="Connect with communities"
          onClick={() => onSelect("contribute")}
          delay={1.3}
        />
      </motion.div>
    </motion.div>
  );
}

function IntentButton({ 
  label, 
  onClick, 
  delay 
}: { 
  label: string; 
  onClick: () => void; 
  delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full py-5 text-left border-b border-white/10 hover:border-white/30 transition-all duration-500 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ x: 8 }}
    >
      <div className="text-base text-white/90 group-hover:text-white transition-colors duration-500">
        {label}
      </div>
    </motion.button>
  );
}

// Step 3: Account Creation
function AccountStep({ 
  onComplete, 
  onSignIn,
  onRecover,
  isLoading, 
  error,
}: { 
  onComplete: (email: string, password: string, name: string) => void; 
  onSignIn: (email: string, password: string) => void;
  onRecover: (email: string) => Promise<string | null>;
  isLoading: boolean; 
  error: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<'signup' | 'signin' | 'recovery'>('signup');
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const showSignInSuggestion = (error || localError) && (
    (error || localError || '').includes('already exists') || 
    (error || localError || '').includes('already been registered')
  );
  
  // Password validation state
  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  
  const isPasswordValid = Object.values(passwordValidation).every(v => v);

  const handleSubmit = () => {
    if (mode === 'signup') {
      // Client-side validation before submitting
      if (!isPasswordValid) {
        setLocalError('Please ensure your password meets all requirements');
        return;
      }
      setLocalError(null); // Clear local error before submitting
      onComplete(email, password, name);
    } else if (mode === 'signin') {
      setLocalError(null);
      onSignIn(email, password);
    } else if (mode === 'recovery') {
      setLocalError(null);
      onRecover(recoveryEmail).then((message) => {
        if (message) {
          setRecoveryMessage(message);
          setTimeout(() => {
            setMode('signin');
            setRecoveryMessage("");
          }, 3000);
        }
      });
    }
  };

  // Determine if form is valid
  const isFormValid = () => {
    if (mode === 'signup') {
      return email && name && password && isPasswordValid;
    } else if (mode === 'signin') {
      return email && password;
    } else if (mode === 'recovery') {
      return recoveryEmail;
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md px-6 w-full"
    >
      <AnimatePresence mode="wait">
        <motion.h2 
          key={mode}
          className="text-xl leading-relaxed text-white/80 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
        >
          {mode === 'signup' && 'Create your account'}
          {mode === 'signin' && 'Welcome back'}
          {mode === 'recovery' && 'Reset your password'}
        </motion.h2>
      </AnimatePresence>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <AnimatePresence mode="wait">
          {mode === 'recovery' ? (
            // Password Recovery Form
            <motion.div
              key="recovery-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="Email"
                className="w-full py-3 px-4 text-sm text-white/90 bg-black border border-white/10 rounded focus:outline-none focus:border-white/30 transition-colors duration-300"
              />
              {recoveryMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-500/80"
                >
                  {recoveryMessage}
                </motion.p>
              )}
            </motion.div>
          ) : (
            // Sign Up / Sign In Form
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full py-3 px-4 text-sm text-white/90 bg-black border border-white/10 rounded focus:outline-none focus:border-white/30 transition-colors duration-300"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full py-3 px-4 text-sm text-white/90 bg-black border border-white/10 rounded focus:outline-none focus:border-white/30 transition-colors duration-300"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full py-3 px-4 text-sm text-white/90 bg-black border border-white/10 rounded focus:outline-none focus:border-white/30 transition-colors duration-300"
              />
              {/* Password Requirements */}
              {mode === 'signup' && password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs space-y-1.5 text-left"
                >
                  <div className={`flex items-center gap-2 ${passwordValidation.length ? 'text-green-500/80' : 'text-white/40'}`}>
                    <span>{passwordValidation.length ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.uppercase ? 'text-green-500/80' : 'text-white/40'}`}>
                    <span>{passwordValidation.uppercase ? '✓' : '○'}</span>
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.lowercase ? 'text-green-500/80' : 'text-white/40'}`}>
                    <span>{passwordValidation.lowercase ? '✓' : '○'}</span>
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.number ? 'text-green-500/80' : 'text-white/40'}`}>
                    <span>{passwordValidation.number ? '✓' : '○'}</span>
                    <span>One number</span>
                  </div>
                </motion.div>
              )}
              {mode === 'signup' && password.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-white/40 space-y-1"
                >
                  <p>Password must include:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Messages */}
        {error || localError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-red-500/80">
              {error || localError}
            </p>
            {showSignInSuggestion && (
              <button
                onClick={() => setMode('signin')}
                className="text-sm text-white/60 hover:text-white/90 underline underline-offset-2 transition-all duration-300"
              >
                Sign in instead
              </button>
            )}
          </motion.div>
        )}

        {/* Primary Action Button */}
        <motion.button
          onClick={handleSubmit}
          className="w-full py-5 text-sm tracking-wider uppercase text-white/90 hover:text-white border-t border-white/10 hover:border-white/20 transition-all duration-500 group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10"
          disabled={!isFormValid() || isLoading}
          whileHover={{ y: !isFormValid() || isLoading ? 0 : -2 }}
          whileTap={{ scale: !isFormValid() || isLoading ? 1 : 0.98 }}
        >
          <span className="inline-flex items-center gap-2">
            {isLoading ? (
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Processing...
              </motion.span>
            ) : (
              <>
                {mode === 'signup' && 'Create Account'}
                {mode === 'signin' && 'Sign In'}
                {mode === 'recovery' && 'Send Recovery Link'}
              </>
            )}
          </span>
        </motion.button>
        
        {/* Mode Switching Links */}
        <div className="pt-6 space-y-2 border-t border-white/5">
          {mode === 'signin' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMode('recovery')}
              className="w-full py-2 text-xs text-white/40 hover:text-white/60 transition-all duration-300"
            >
              Forgot password?
            </motion.button>
          )}
          
          {mode === 'signup' ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMode('signin')}
              className="w-full py-2 text-xs text-white/50 hover:text-white/70 transition-all duration-300"
            >
              Already have an account? Sign in
            </motion.button>
          ) : mode === 'signin' ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMode('signup')}
              className="w-full py-2 text-xs text-white/50 hover:text-white/70 transition-all duration-300"
            >
              Need an account? Create one
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMode('signin')}
              className="w-full py-2 text-xs text-white/50 hover:text-white/70 transition-all duration-300"
            >
              Back to sign in
            </motion.button>
          )}
        </div>

        {/* OAuth/Social Login Placeholder - Future Implementation */}
        {mode !== 'recovery' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-6 space-y-3"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 text-white/30 bg-black">Or continue with</span>
              </div>
            </div>
            
            {/* Social login buttons - disabled for now, ready for future implementation */}
            <div className="grid grid-cols-2 gap-3 opacity-30 pointer-events-none">
              <button
                className="py-3 text-xs text-white/60 bg-white/5 border border-white/10 rounded transition-all duration-300"
                disabled
              >
                Google
              </button>
              <button
                className="py-3 text-xs text-white/60 bg-white/5 border border-white/10 rounded transition-all duration-300"
                disabled
              >
                GitHub
              </button>
            </div>
            <p className="text-[10px] text-white/20 text-center">
              Social login coming soon
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Step 4: Presence Setup
function PresenceStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md px-6"
    >
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <p className="text-lg leading-relaxed text-white/70 mb-6">
          Your presence will form here.
        </p>
        
        <p className="text-base leading-relaxed text-white/50">
          As you create, explore, and contribute, this space becomes yours.
        </p>
      </motion.div>
      
      <motion.button
        onClick={onNext}
        className="px-8 py-3 text-sm tracking-wider uppercase text-white/90 hover:text-white transition-all duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        whileHover={{ y: -2 }}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

// Step 5: Threshold
function ThresholdStep({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md px-6"
    >
      <motion.h1 
        className="text-2xl leading-relaxed text-white/90 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        You are now SEEN.
      </motion.h1>
      
      <motion.button
        onClick={onEnter}
        className="px-8 py-3 text-sm tracking-wider uppercase text-white hover:text-white/90 transition-all duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
        whileHover={{ y: -2 }}
      >
        Enter
      </motion.button>
    </motion.div>
  );
}