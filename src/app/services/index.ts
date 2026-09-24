/**
 * Single entry point for feature data. Screens import `api` from here and
 * never reach into an adapter directly, so swapping the demo adapter for a
 * Supabase-backed one is a one-line change (see ADR-002).
 */
import { demoAdapter } from "./demo/adapter";
import type { SeenApi } from "./contracts";

export const api: SeenApi = demoAdapter;

export * from "./contracts";
export { ServiceError, getSimulation, setSimulation } from "./runtime";
export { pushNotification } from "./demo/adapter";
export { deadlineState, formatAmount, formatDeadline } from "./funding";
