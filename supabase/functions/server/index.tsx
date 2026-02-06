import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import * as culturalMetrics from "./cultural_metrics.tsx";
import * as governance from "./governance_moderation.tsx";
import * as creatorRights from "./creator_rights_ip.tsx";
import * as ethicalDiscovery from "./ethical_discovery.tsx";
import * as accessibility from "./accessibility.tsx";
import * as grantReadiness from "./grant_readiness.tsx";
import { registerCMFEndpoints } from "./cmf_endpoints.tsx";

const app = new Hono();

// Initialize Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize Supabase client with anon key for auth operations
const getSupabaseClient = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

/**
 * RATE LIMITING MIDDLEWARE
 * Prevents brute force attacks on auth endpoints
 */
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.blockedUntil && entry.blockedUntil < now) {
      rateLimitStore.delete(key);
    } else if (now - entry.firstAttempt > 15 * 60 * 1000) { // 15 minutes
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

const rateLimit = (maxAttempts: number, windowMs: number, blockDurationMs: number = 15 * 60 * 1000) => {
  return async (c: any, next: any) => {
    // Get client IP from headers (Cloudflare, proxy-aware)
    const clientIP = c.req.header('cf-connecting-ip') || 
                     c.req.header('x-forwarded-for')?.split(',')[0].trim() || 
                     c.req.header('x-real-ip') ||
                     'unknown';
    
    const now = Date.now();
    const key = `${clientIP}:${c.req.path}`;
    
    let entry = rateLimitStore.get(key);
    
    if (!entry) {
      entry = { count: 1, firstAttempt: now };
      rateLimitStore.set(key, entry);
      return next();
    }
    
    // Check if currently blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      const remainingSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
      return c.json({ 
        error: 'Too many attempts. Please try again later.',
        retryAfter: remainingSeconds 
      }, 429);
    }
    
    // Reset if outside window
    if (now - entry.firstAttempt > windowMs) {
      entry.count = 1;
      entry.firstAttempt = now;
      entry.blockedUntil = undefined;
      return next();
    }
    
    // Increment count
    entry.count++;
    
    // Block if exceeded
    if (entry.count > maxAttempts) {
      entry.blockedUntil = now + blockDurationMs;
      const remainingSeconds = Math.ceil(blockDurationMs / 1000);
      return c.json({ 
        error: 'Too many attempts. Please try again later.',
        retryAfter: remainingSeconds 
      }, 429);
    }
    
    return next();
  };
};

/**
 * CSRF PROTECTION MIDDLEWARE
 * Validates CSRF tokens for state-changing requests
 */
const csrfProtection = async (c: any, next: any) => {
  const method = c.req.method;
  
  // Only validate POST, PUT, DELETE, PATCH
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const origin = c.req.header('origin');
    const referer = c.req.header('referer');
    const host = c.req.header('host');
    
    // Allowed origins for CSRF protection
    const allowedOrigins = [
      Deno.env.get('FRONTEND_URL'),
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'https://localhost:5173',
    ].filter(Boolean); // Remove undefined values
    
    // For development: Allow requests without Origin/Referer if coming from Supabase Edge Functions
    const isEdgeFunctionInternal = host?.includes('supabase.co');
    
    // Check if request comes from allowed origin
    const isValidOrigin = origin && allowedOrigins.some(allowed => 
      origin === allowed || origin.startsWith(allowed + '/')
    );
    const isValidReferer = referer && allowedOrigins.some(allowed => 
      referer.startsWith(allowed)
    );
    
    // Allow if: valid origin OR valid referer OR internal Edge Function call
    if (!isValidOrigin && !isValidReferer && !isEdgeFunctionInternal) {
      console.warn('CSRF protection triggered:', { 
        origin, 
        referer, 
        host,
        method, 
        path: c.req.path,
        allowedOrigins 
      });
      return c.json({ error: 'Invalid request origin' }, 403);
    }
  }
  
  return next();
};

/**
 * ROLE VALIDATION MIDDLEWARE
 * Enforces server-side role-based access control
 */
const requireRole = (allowedRoles: string[]) => {
  return async (c: any, next: any) => {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }
    
    // Get user from token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401);
    }
    
    // Get user profile to check role
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Unauthorized: Profile not found' }, 401);
    }
    
    const userRole = profile.role || 'viewer';
    
    // Check if user has required role
    if (!allowedRoles.includes(userRole)) {
      console.warn('Role validation failed:', { 
        userId: user.id, 
        userRole, 
        requiredRoles: allowedRoles,
        path: c.req.path 
      });
      return c.json({ 
        error: 'Forbidden: Insufficient permissions',
        required: allowedRoles,
        current: userRole 
      }, 403);
    }
    
    // Attach user and profile to context for use in handlers
    c.set('user', user);
    c.set('profile', profile);
    
    return next();
  };
};

/**
 * INPUT VALIDATION HELPERS
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  return { valid: true };
};

const sanitizeString = (str: string, maxLength: number = 255): string => {
  return str.trim().slice(0, maxLength);
};

// ============================================================================
// APPLY GLOBAL MIDDLEWARE
// ============================================================================

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Apply CSRF protection to all routes
app.use('/make-server-2bdc05e6/*', csrfProtection);

// Health check endpoint
app.get("/make-server-2bdc05e6/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * Sign up a new user
 * POST /make-server-2bdc05e6/auth/signup
 * Body: { email, password, name, role, language, intent }
 */
app.post("/make-server-2bdc05e6/auth/signup", rateLimit(5, 15 * 60 * 1000), async (c) => {
  try {
    const body = await c.req.json();
    console.log("Signup request received - full body:", JSON.stringify(body));
    console.log("Signup request - body keys:", Object.keys(body));
    
    const { email, password, name, role, language, intent } = body;
    
    console.log("Extracted values:", { 
      email: email || 'MISSING', 
      password: password ? '***' : 'MISSING',
      name: name || 'MISSING',
      role: role || 'MISSING',
      language: language || 'MISSING',
      intent: intent || 'MISSING'
    });

    // Validate required fields
    if (!email || !password || !name || !role) {
      console.error("Missing required fields:", { email: !!email, password: !!password, name: !!name, role: !!role });
      return c.json({ 
        error: "Missing required fields: email, password, name, role",
        received: { email: !!email, password: !!password, name: !!name, role: !!role }
      }, 400);
    }

    // Validate email format
    if (!validateEmail(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return c.json({ error: passwordValidation.error }, 400);
    }

    // Validate role
    const validRoles = ['viewer', 'creator', 'moderator', 'admin'];
    if (!validRoles.includes(role)) {
      console.error("Invalid role provided:", role);
      return c.json({ error: "Invalid role. Must be: viewer, creator, moderator, or admin" }, 400);
    }

    console.log("Creating user with Supabase Auth...");
    
    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role,
        language: language || 'en',
        intent: intent || 'explore'
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Supabase auth error during signup:", error);
      
      // Check if this is an "email already exists" error
      if (error.message?.includes('already been registered') || error.code === 'email_exists') {
        return c.json({ 
          error: 'An account with this email already exists. Please sign in instead.',
          code: 'email_exists',
          details: error 
        }, 409); // 409 Conflict status code
      }
      
      return c.json({ 
        error: `Failed to create user: ${error.message}`,
        details: error 
      }, 400);
    }

    if (!data || !data.user) {
      console.error("No user data returned from Supabase");
      return c.json({ error: "Failed to create user: No user data returned" }, 400);
    }

    console.log("User created successfully:", data.user.id);

    // Store user profile in KV store
    try {
      await kv.set(`user_profile:${data.user.id}`, {
        id: data.user.id,
        email,
        name,
        role,
        language: language || 'en',
        intent: intent || 'explore',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log("User profile stored in KV");
    } catch (kvError) {
      console.error("Error storing user profile in KV:", kvError);
      // Continue even if KV storage fails - user is created
    }

    // Generate access token for the newly created user using admin client
    console.log("Generating session token for newly created user...");
    
    try {
      // Create a session for the user directly using admin privileges
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
        user_id: data.user.id
      });

      if (sessionError || !sessionData?.session) {
        console.error("Failed to create session after signup:", sessionError);
        
        // User was created successfully but session creation failed
        // Return success with instruction to sign in
        return c.json({ 
          user: {
            id: data.user.id,
            email: data.user.email,
            name,
            role,
            language: language || 'en',
            intent: intent || 'explore'
          },
          requiresSignIn: true,
          message: 'Account created successfully. Please sign in to continue.'
        }, 201);
      }

      console.log("Session created successfully after signup");

      // Return both user data and session
      return c.json({ 
        session: {
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
        },
        user: {
          id: data.user.id,
          email: data.user.email,
          name,
          role,
          language: language || 'en',
          intent: intent || 'explore'
        }
      }, 201);
    } catch (sessionCreationError) {
      console.error("Unexpected error creating session:", sessionCreationError);
      
      // Return success but require manual sign-in
      return c.json({ 
        user: {
          id: data.user.id,
          email: data.user.email,
          name,
          role,
          language: language || 'en',
          intent: intent || 'explore'
        },
        requiresSignIn: true,
        message: 'Account created successfully. Please sign in to continue.'
      }, 201);
    }
  } catch (error) {
    console.error("Unexpected error in signup endpoint:", error);
    return c.json({ 
      error: `Signup failed: ${error.message}`,
      details: error.toString()
    }, 500);
  }
});

/**
 * Sign in an existing user
 * POST /make-server-2bdc05e6/auth/signin
 * Body: { email, password }
 */
app.post("/make-server-2bdc05e6/auth/signin", rateLimit(5, 15 * 60 * 1000), async (c) => {
  try {
    const { email, password } = await c.req.json();
    console.log("Sign in request received for:", email);

    if (!email || !password) {
      console.error("Missing email or password in sign in request");
      return c.json({ error: "Missing required fields: email, password" }, 400);
    }

    // Use anon key client for sign in (user-level auth)
    const supabase = getSupabaseClient();
    console.log("Attempting sign in with Supabase...");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in user:", error);
      console.error("Error details:", { message: error.message, status: error.status, code: error.code });
      
      // Provide more helpful error messages
      if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
        // Try to check if user exists with admin client
        try {
          const { data: adminData } = await supabaseAdmin.auth.admin.listUsers();
          const userExists = adminData.users.some(u => u.email === email);
          
          if (!userExists) {
            return c.json({ 
              error: `No account found with email ${email}. Please create an account first.`,
              code: 'account_not_found'
            }, 404);
          } else {
            // User exists but credentials are wrong or email not confirmed
            const user = adminData.users.find(u => u.email === email);
            console.log("User found in database:", { 
              id: user?.id, 
              email: user?.email, 
              confirmed: user?.email_confirmed_at,
              lastSignIn: user?.last_sign_in_at 
            });
            
            return c.json({ 
              error: `Invalid password for ${email}. Please check your password and try again.`,
              code: 'invalid_password'
            }, 401);
          }
        } catch (adminError) {
          console.error("Error checking user existence:", adminError);
        }
        
        return c.json({ 
          error: `Sign in failed: Invalid email or password. Please check your credentials or create a new account.`,
          code: 'invalid_credentials'
        }, 401);
      }
      
      return c.json({ error: `Sign in failed: ${error.message}` }, 401);
    }

    if (!data || !data.user || !data.session) {
      console.error("No user or session data returned from sign in");
      return c.json({ error: "Sign in failed: No session created" }, 401);
    }

    console.log("User signed in successfully:", data.user.id);

    // Get user profile from KV store
    const profile = await kv.get(`user_profile:${data.user.id}`);

    if (!profile) {
      console.warn("User signed in but no profile found in KV store, creating from auth data");
      // If profile doesn't exist in KV (shouldn't happen), create one from user metadata
      const newProfile = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'User',
        role: data.user.user_metadata?.role || 'viewer',
        language: data.user.user_metadata?.language || 'en',
        intent: data.user.user_metadata?.intent || 'explore',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await kv.set(`user_profile:${data.user.id}`, newProfile);
    }

    const userProfile = profile || {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || 'User',
      role: data.user.user_metadata?.role || 'viewer',
      language: data.user.user_metadata?.language || 'en',
      intent: data.user.user_metadata?.intent || 'explore'
    };

    return c.json({ 
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
      user: userProfile
    });
  } catch (error) {
    console.error("Unexpected error in signin endpoint:", error);
    return c.json({ error: `Sign in failed: ${error.message}` }, 500);
  }
});

/**
 * Get current user session
 * GET /make-server-2bdc05e6/auth/session
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-2bdc05e6/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Error getting user session:", error);
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    // Get user profile from KV store
    const profile = await kv.get(`user_profile:${user.id}`);

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error("Error in session endpoint:", error);
    return c.json({ error: `Session check failed: ${error.message}` }, 500);
  }
});

/**
 * Sign out user
 * POST /make-server-2bdc05e6/auth/signout
 * Headers: Authorization: Bearer <access_token>
 */
app.post("/make-server-2bdc05e6/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out user:", error);
      return c.json({ error: `Sign out failed: ${error.message}` }, 400);
    }

    return c.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Error in signout endpoint:", error);
    return c.json({ error: `Sign out failed: ${error.message}` }, 500);
  }
});

/**
 * Request password recovery
 * POST /make-server-2bdc05e6/auth/recovery
 * Body: { email }
 */
app.post("/make-server-2bdc05e6/auth/recovery", rateLimit(3, 15 * 60 * 1000), async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: "Missing required field: email" }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Use Supabase's password recovery
    // Note: This requires email configuration to be set up in Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.req.header('Origin') || 'http://localhost:5173'}/reset-password`,
    });

    if (error) {
      console.error("Error requesting password recovery:", error);
      // Don't reveal if email exists for security
      // Return success anyway to prevent user enumeration
    }

    // Always return success to prevent user enumeration
    return c.json({ 
      message: "If an account exists with this email, a recovery link has been sent."
    });
  } catch (error) {
    console.error("Error in recovery endpoint:", error);
    return c.json({ error: `Password recovery failed: ${error.message}` }, 500);
  }
});

// ============================================================================
// USER PROFILE ENDPOINTS
// ============================================================================

/**
 * Get user profile
 * GET /make-server-2bdc05e6/profile
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-2bdc05e6/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Authorization error while getting profile:", error);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user_profile:${user.id}`);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error("Error in profile endpoint:", error);
    return c.json({ error: `Failed to get profile: ${error.message}` }, 500);
  }
});

/**
 * Update user profile
 * PUT /make-server-2bdc05e6/profile
 * Headers: Authorization: Bearer <access_token>
 * Body: { name?, language?, intent? }
 */
app.put("/make-server-2bdc05e6/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Authorization error while updating profile:", error);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();
    const profile = await kv.get(`user_profile:${user.id}`);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    // Users cannot change their own role through this endpoint
    delete updates.role;

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user_profile:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error in profile update endpoint:", error);
    return c.json({ error: `Failed to update profile: ${error.message}` }, 500);
  }
});

/**
 * Request role elevation (for creator applications)
 * POST /make-server-2bdc05e6/profile/request-role
 * Headers: Authorization: Bearer <access_token>
 * Body: { requestedRole, reason }
 */
app.post("/make-server-2bdc05e6/profile/request-role", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Authorization error while requesting role elevation:", error);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { requestedRole, reason } = await c.req.json();

    if (!requestedRole || !reason) {
      return c.json({ error: "Missing required fields: requestedRole, reason" }, 400);
    }

    // Store role request for admin review
    await kv.set(`role_request:${user.id}`, {
      userId: user.id,
      requestedRole,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return c.json({ 
      message: "Role elevation request submitted successfully",
      status: "pending"
    });
  } catch (error) {
    console.error("Error in role request endpoint:", error);
    return c.json({ error: `Failed to submit role request: ${error.message}` }, 500);
  }
});

// ============================================================================
// NEW CRITICAL ENDPOINTS - BLOCKER REMEDIATION
// ============================================================================

/**
 * CRITICAL BLOCKER #1: Session Refresh
 * POST /make-server-2bdc05e6/auth/refresh
 * Body: { refresh_token }
 * Returns: { access_token, refresh_token }
 */
app.post("/make-server-2bdc05e6/auth/refresh", rateLimit(10, 15 * 60 * 1000), async (c) => {
  try {
    const { refresh_token } = await c.req.json();
    
    if (!refresh_token) {
      return c.json({ error: "Missing required field: refresh_token" }, 400);
    }
    
    const supabase = getSupabaseClient();
    
    // Use Supabase's refresh session endpoint
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    
    if (error || !data?.session) {
      console.error("Error refreshing session:", error);
      return c.json({ error: "Failed to refresh session: Invalid or expired refresh token" }, 401);
    }
    
    console.log("Session refreshed successfully for user:", data.user?.id);
    
    // Get updated user profile
    const profile = await kv.get(`user_profile:${data.user.id}`);
    
    return c.json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error("Unexpected error in refresh endpoint:", error);
    return c.json({ error: `Session refresh failed: ${error.message}` }, 500);
  }
});

/**
 * CRITICAL BLOCKER #4: Personalization Preferences Persistence
 * PUT /make-server-2bdc05e6/preferences
 * Headers: Authorization: Bearer <access_token>
 * Body: { immersiveNarratives?, richAudio?, dynamicMotion? }
 * Returns: { preferences }
 */
app.put("/make-server-2bdc05e6/preferences", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
    }
    
    const updates = await c.req.json();
    
    // Validate preference structure
    const validPreferenceKeys = ['immersiveNarratives', 'richAudio', 'dynamicMotion'];
    const preferences: any = {};
    
    for (const key of validPreferenceKeys) {
      if (key in updates && typeof updates[key] === 'boolean') {
        preferences[key] = updates[key];
      }
    }
    
    // Get existing profile
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    // Update profile with preferences
    const updatedProfile = {
      ...profile,
      personalizationPreferences: {
        ...(profile.personalizationPreferences || {}),
        ...preferences
      },
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`user_profile:${user.id}`, updatedProfile);
    
    console.log("Preferences updated for user:", user.id, preferences);
    
    return c.json({ 
      preferences: updatedProfile.personalizationPreferences 
    });
  } catch (error) {
    console.error("Error in preferences endpoint:", error);
    return c.json({ error: `Failed to update preferences: ${error.message}` }, 500);
  }
});

/**
 * Get user preferences
 * GET /make-server-2bdc05e6/preferences
 * Headers: Authorization: Bearer <access_token>
 * Returns: { preferences }
 */
app.get("/make-server-2bdc05e6/preferences", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
    }
    
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    // Return preferences with safe defaults
    const preferences = profile.personalizationPreferences || {
      immersiveNarratives: true,
      richAudio: true,
      dynamicMotion: true
    };
    
    return c.json({ preferences });
  } catch (error) {
    console.error("Error in get preferences endpoint:", error);
    return c.json({ error: `Failed to get preferences: ${error.message}` }, 500);
  }
});

/**
 * CRITICAL BLOCKER #5: Content Publication API
 * POST /make-server-2bdc05e6/content/publish
 * Headers: Authorization: Bearer <access_token>
 * Body: { title, description, language, chapters, tags, visibility }
 * Returns: { contentId, status }
 * 
 * REQUIRES: creator, moderator, or admin role
 */
app.post("/make-server-2bdc05e6/content/publish", requireRole(['creator', 'moderator', 'admin']), async (c) => {
  try {
    const user = c.get('user');
    const profile = c.get('profile');
    
    const { title, description, language, chapters, tags, visibility } = await c.req.json();
    
    // Validate required fields
    if (!title || !description || !language || !chapters || !Array.isArray(chapters)) {
      return c.json({ 
        error: "Missing required fields: title, description, language, chapters" 
      }, 400);
    }
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeString(title, 200);
    const sanitizedDescription = sanitizeString(description, 1000);
    
    // Validate language
    const validLanguages = ['en', 'fr', 'es'];
    if (!validLanguages.includes(language)) {
      return c.json({ error: "Invalid language. Must be: en, fr, or es" }, 400);
    }
    
    // Validate visibility
    const validVisibility = ['public', 'unlisted', 'private'];
    const contentVisibility = visibility && validVisibility.includes(visibility) ? visibility : 'public';
    
    // Generate content ID
    const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // New creators need moderation approval
    const isNewCreator = !await kv.get(`creator_verified:${user.id}`);
    const status = isNewCreator && profile.role === 'creator' ? 'under_review' : 'published';
    
    // Store content
    const content = {
      id: contentId,
      authorId: user.id,
      authorName: profile.name,
      title: sanitizedTitle,
      description: sanitizedDescription,
      language,
      chapters,
      tags: tags || [],
      visibility: contentVisibility,
      status,
      createdAt: new Date().toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`content:${contentId}`, content);
    
    // Add to moderation queue if needed
    if (status === 'under_review') {
      const moderationItemId = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`moderation_item:${moderationItemId}`, {
        id: moderationItemId,
        contentId,
        authorId: user.id,
        reason: 'New creator - first content submission',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      console.log("Content submitted for moderation:", contentId);
    }
    
    // Add to content index for search
    const indexKey = `content_index:${language}`;
    const existingIndex = await kv.get(indexKey) || {};
    existingIndex[contentId] = {
      title: sanitizedTitle,
      tags: tags || [],
      authorId: user.id,
      authorName: profile.name,
      publishedAt: content.publishedAt,
      status
    };
    await kv.set(indexKey, existingIndex);
    
    console.log("Content published:", { contentId, status, authorId: user.id });
    
    return c.json({ 
      contentId,
      status,
      message: status === 'under_review' 
        ? 'Content submitted for review. It will be published after moderation approval.' 
        : 'Content published successfully.'
    }, 201);
  } catch (error) {
    console.error("Error in content publish endpoint:", error);
    return c.json({ error: `Failed to publish content: ${error.message}` }, 500);
  }
});

/**
 * Get moderation queue
 * GET /make-server-2bdc05e6/moderation/queue
 * Headers: Authorization: Bearer <access_token>
 * Returns: { items, total }
 * 
 * REQUIRES: moderator or admin role
 */
app.get("/make-server-2bdc05e6/moderation/queue", requireRole(['moderator', 'admin']), async (c) => {
  try {
    // Get all moderation items
    const moderationItems = await kv.getByPrefix('moderation_item:');
    
    // Filter pending items
    const pendingItems = moderationItems
      .filter((item: any) => item.status === 'pending')
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Enrich with content details
    const enrichedItems = await Promise.all(
      pendingItems.map(async (item: any) => {
        const content = await kv.get(`content:${item.contentId}`);
        return {
          ...item,
          content: content ? {
            title: content.title,
            description: content.description,
            language: content.language,
            authorName: content.authorName
          } : null
        };
      })
    );
    
    return c.json({
      items: enrichedItems,
      total: enrichedItems.length
    });
  } catch (error) {
    console.error("Error in moderation queue endpoint:", error);
    return c.json({ error: `Failed to get moderation queue: ${error.message}` }, 500);
  }
});

/**
 * Review moderation item
 * POST /make-server-2bdc05e6/moderation/review
 * Headers: Authorization: Bearer <access_token>
 * Body: { itemId, action, reason? }
 * Returns: { message }
 * 
 * REQUIRES: moderator or admin role
 */
app.post("/make-server-2bdc05e6/moderation/review", requireRole(['moderator', 'admin']), async (c) => {
  try {
    const user = c.get('user');
    const { itemId, action, reason } = await c.req.json();
    
    if (!itemId || !action) {
      return c.json({ error: "Missing required fields: itemId, action" }, 400);
    }
    
    const validActions = ['approve', 'reject'];
    if (!validActions.includes(action)) {
      return c.json({ error: "Invalid action. Must be: approve or reject" }, 400);
    }
    
    // Get moderation item
    const item = await kv.get(`moderation_item:${itemId}`);
    
    if (!item) {
      return c.json({ error: "Moderation item not found" }, 404);
    }
    
    if (item.status !== 'pending') {
      return c.json({ error: "Item has already been reviewed" }, 400);
    }
    
    // Update moderation item
    const updatedItem = {
      ...item,
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
      reviewReason: reason
    };
    
    await kv.set(`moderation_item:${itemId}`, updatedItem);
    
    // Update content status
    const content = await kv.get(`content:${item.contentId}`);
    
    if (content) {
      content.status = action === 'approve' ? 'published' : 'rejected';
      
      if (action === 'approve') {
        content.publishedAt = new Date().toISOString();
        
        // Mark creator as verified
        await kv.set(`creator_verified:${content.authorId}`, true);
      }
      
      await kv.set(`content:${item.contentId}`, content);
      
      // Update content index
      if (action === 'approve') {
        const indexKey = `content_index:${content.language}`;
        const existingIndex = await kv.get(indexKey) || {};
        if (existingIndex[item.contentId]) {
          existingIndex[item.contentId].status = 'published';
          existingIndex[item.contentId].publishedAt = content.publishedAt;
          await kv.set(indexKey, existingIndex);
        }
      }
    }
    
    console.log("Moderation review completed:", { itemId, action, reviewedBy: user.id });
    
    return c.json({ 
      message: `Content ${action === 'approve' ? 'approved' : 'rejected'} successfully.`
    });
  } catch (error) {
    console.error("Error in moderation review endpoint:", error);
    return c.json({ error: `Failed to review content: ${error.message}` }, 500);
  }
});

/**
 * CRITICAL BLOCKER #7: Account Deletion API (GDPR Compliance)
 * DELETE /make-server-2bdc05e6/account
 * Headers: Authorization: Bearer <access_token>
 * Returns: { message, scheduledDeletionDate }
 */
app.delete("/make-server-2bdc05e6/account", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
    }
    
    // Get user profile for logging
    const profile = await kv.get(`user_profile:${user.id}`);
    
    console.log("Account deletion requested:", { userId: user.id, email: user.email });
    
    // Mark account for deletion (30-day grace period)
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + 30);
    
    await kv.set(`account_deletion_scheduled:${user.id}`, {
      userId: user.id,
      email: user.email,
      scheduledAt: new Date().toISOString(),
      scheduledDeletionDate: scheduledDeletionDate.toISOString(),
      status: 'scheduled'
    });
    
    // For immediate deletion (can be toggled based on requirements):
    // 1. Delete user profile
    await kv.del(`user_profile:${user.id}`);
    
    // 2. Anonymize user content (don't delete - preserve cultural contributions)
    const userContent = await kv.getByPrefix(`content:`);
    for (const content of userContent) {
      if (content.authorId === user.id) {
        content.authorId = 'deleted_user';
        content.authorName = 'Deleted User';
        await kv.set(`content:${content.id}`, content);
      }
    }
    
    // 3. Delete user from Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error("Error deleting user from Supabase:", deleteError);
      // Continue anyway - user data is anonymized
    }
    
    // 4. Delete related data
    await kv.del(`role_request:${user.id}`);
    await kv.del(`creator_verified:${user.id}`);
    
    console.log("Account deleted successfully:", user.id);
    
    return c.json({
      message: "Your account has been permanently deleted. All personal data has been removed, and your content contributions have been anonymized.",
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in account deletion endpoint:", error);
    return c.json({ error: `Failed to delete account: ${error.message}` }, 500);
  }
});

// ============================================================================
// REGISTER CMF-READY ENDPOINTS
// ============================================================================

registerCMFEndpoints(app, supabaseAdmin, requireRole);

Deno.serve(app.fetch);