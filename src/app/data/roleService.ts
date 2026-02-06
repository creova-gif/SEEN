/**
 * ROLE RESOLUTION SERVICE
 * SEEN by CREOVA
 * 
 * Handles automatic role assignment based on user actions
 * Prevents manual role switching in production
 */

import type { UserRole } from '../contexts/StoryStateContext';

const ROLE_STORAGE_KEY = 'seenos_user_role';
const CREATOR_MILESTONE_KEY = 'seenos_creator_milestone';

/**
 * Get user's current role from persistent storage
 */
export function getUserRole(): UserRole {
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY);
    if (stored && isValidRole(stored)) {
      return stored as UserRole;
    }
  } catch (error) {
    console.error('Failed to load user role:', error);
  }
  return 'viewer'; // Default role
}

/**
 * Set user role (internal use only - not exposed to UI in production)
 */
function setUserRole(role: UserRole): void {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch (error) {
    console.error('Failed to save user role:', error);
  }
}

/**
 * Validate role string
 */
function isValidRole(role: string): boolean {
  return ['viewer', 'creator', 'moderator', 'admin'].includes(role);
}

/**
 * Check if user has reached creator milestone
 */
export function hasCreatorMilestone(): boolean {
  try {
    const milestone = localStorage.getItem(CREATOR_MILESTONE_KEY);
    return milestone === 'true';
  } catch (error) {
    return false;
  }
}

/**
 * Mark creator milestone as reached
 */
function setCreatorMilestone(): void {
  try {
    localStorage.setItem(CREATOR_MILESTONE_KEY, 'true');
  } catch (error) {
    console.error('Failed to save creator milestone:', error);
  }
}

/**
 * Automatically upgrade user to creator when they publish first content
 * This is the ONLY way to become a creator in production
 */
export function onFirstContentPublished(): UserRole {
  const currentRole = getUserRole();
  
  // Only upgrade viewers
  if (currentRole === 'viewer' && !hasCreatorMilestone()) {
    setUserRole('creator');
    setCreatorMilestone();
    return 'creator';
  }
  
  return currentRole;
}

/**
 * Check if user has permission to access a route
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 0,
    creator: 1,
    moderator: 2,
    admin: 3
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Get permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    viewer: ['view_content', 'save_content', 'respond_to_stories'],
    creator: ['view_content', 'save_content', 'respond_to_stories', 'create_content', 'view_analytics'],
    moderator: ['view_content', 'save_content', 'respond_to_stories', 'create_content', 'view_analytics', 'moderate_content', 'review_submissions'],
    admin: ['view_content', 'save_content', 'respond_to_stories', 'create_content', 'view_analytics', 'moderate_content', 'review_submissions', 'manage_users', 'manage_institutional_collections']
  };
  
  return permissions[role] || permissions.viewer;
}

/**
 * Get navigation tabs visible to a role
 */
export function getVisibleTabs(role: UserRole): string[] {
  const baseTabs = ['for-you', 'explore', 'library', 'profile'];
  
  const additionalTabs: Record<UserRole, string[]> = {
    viewer: [],
    creator: ['create', 'dashboard'],
    moderator: ['create', 'dashboard', 'moderation'],
    admin: ['create', 'dashboard', 'moderation', 'admin']
  };
  
  return [...baseTabs, ...(additionalTabs[role] || [])];
}

/**
 * DEVELOPMENT ONLY: Manual role override
 * This function should only be called from development tools
 */
export function devSetRole(role: UserRole): void {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Manual role setting is only available in development');
    return;
  }
  setUserRole(role);
}
