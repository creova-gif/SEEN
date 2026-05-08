/**
 * ROUTE GUARDS
 * SEEN by CREOVA
 * 
 * Permission checks and access control for protected screens
 */

import type { UserRole } from '../contexts/StoryStateContext';
import { hasPermission } from './roleService';

export type ProtectedScreen = 
  | 'for-you'
  | 'explore' 
  | 'library'
  | 'profile'
  | 'creator-dashboard'
  | 'moderation'
  | 'admin'
  | 'story-detail';

/**
 * Check if user can access a specific screen
 */
export function canAccessScreen(screen: ProtectedScreen, userRole: UserRole): boolean {
  const screenPermissions: Record<ProtectedScreen, UserRole> = {
    'for-you': 'viewer',
    'explore': 'viewer',
    'library': 'viewer',
    'profile': 'viewer',
    'story-detail': 'viewer',
    'creator-dashboard': 'creator',
    'moderation': 'moderator',
    'admin': 'admin'
  };
  
  const requiredRole = screenPermissions[screen];
  return hasPermission(userRole, requiredRole);
}

/**
 * Get redirect target for unauthorized access
 */
export function getUnauthorizedRedirect(screen: ProtectedScreen, userRole: UserRole): string {
  // If trying to access creator/mod/admin tools, redirect to profile
  if (['creator-dashboard', 'moderation', 'admin'].includes(screen)) {
    return 'profile';
  }
  
  // Default to For You
  return 'for-you';
}

/**
 * Get permission notice message
 */
export function getPermissionNotice(screen: ProtectedScreen, userRole: UserRole): string {
  switch (screen) {
    case 'creator-dashboard':
      return 'Creator tools are only available to users who have published content. Start creating to unlock this feature.';
    case 'moderation':
      return 'Moderation tools are restricted to appointed moderators.';
    case 'admin':
      return 'Administrative features require admin access.';
    default:
      return 'You don\'t have permission to access this area.';
  }
}
