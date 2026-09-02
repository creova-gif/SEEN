/**
 * SUPABASE CLIENT
 * SEEN by CREOVA
 *
 * Single shared Supabase client instance. AuthContext and any Supabase-backed
 * service module should import `supabase` from here rather than creating
 * their own client.
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);
