/**
 * CREATOR MONETIZATION — SERVICE LAYER
 *
 * localStorage-backed implementation of the monetization data layer.
 * Every function here mirrors an endpoint that would exist on
 * supabase/functions/server (e.g. POST /monetization/purchase) — swap the
 * bodies for fetch() calls against that API once it is deployed, keeping
 * signatures identical so calling components never change.
 */

import {
  type ContentPricing,
  type AccessTier,
  type CreatorSubscriptionPlan,
  type Transaction,
  type UserSubscription,
  type OneTimePurchase,
  type PlatformConfig,
  type PayoutRequest,
  type CreatorEarningsSummary,
  DEFAULT_PLATFORM_CONFIG,
} from './monetizationTypes';
import { load, save } from './localStore';

// Stories don't yet carry a first-class creatorId (no creator accounts
// exist in the content database), so we derive a stable id from the
// localized creator name. Once creator accounts exist, replace this with
// the real foreign key.
export function creatorIdFromName(creatorName: string): string {
  return `creator_${creatorName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
}

const KEYS = {
  pricing: 'seenos_content_pricing',
  plans: 'seenos_creator_plans',
  transactions: 'seenos_transactions',
  subscriptions: 'seenos_user_subscriptions',
  purchases: 'seenos_one_time_purchases',
  platformConfig: 'seenos_platform_config',
  payouts: 'seenos_payout_requests',
};

// ============================================
// PLATFORM CONFIG (configurable revenue split)
// ============================================

export function getPlatformConfig(): PlatformConfig {
  const stored = load<PlatformConfig | null>(KEYS.platformConfig, null);
  if (stored) return stored;
  const initial = { ...DEFAULT_PLATFORM_CONFIG, updatedAt: new Date().toISOString() };
  save(KEYS.platformConfig, initial);
  return initial;
}

export function updatePlatformConfig(updates: Partial<PlatformConfig>): PlatformConfig {
  const current = getPlatformConfig();
  const updated: PlatformConfig = { ...current, ...updates, updatedAt: new Date().toISOString() };
  save(KEYS.platformConfig, updated);
  return updated;
}

// ============================================
// CONTENT PRICING (per-story access tier)
// ============================================

export function getContentPricing(contentId: string): ContentPricing {
  const all = load<Record<string, ContentPricing>>(KEYS.pricing, {});
  return all[contentId] ?? {
    contentId,
    accessTier: 'free',
    updatedAt: new Date(0).toISOString(),
  };
}

export function getAllContentPricing(): Record<string, ContentPricing> {
  return load<Record<string, ContentPricing>>(KEYS.pricing, {});
}

export function setContentPricing(
  contentId: string,
  accessTier: AccessTier,
  oneTimePrice?: number
): ContentPricing {
  const all = load<Record<string, ContentPricing>>(KEYS.pricing, {});
  const pricing: ContentPricing = {
    contentId,
    accessTier,
    oneTimePrice: accessTier === 'one-time-purchase' ? oneTimePrice : undefined,
    requiresCreatorSubscription: accessTier === 'subscriber-only',
    updatedAt: new Date().toISOString(),
  };
  all[contentId] = pricing;
  save(KEYS.pricing, all);
  return pricing;
}

// ============================================
// CREATOR SUBSCRIPTION PLANS
// ============================================

export function getCreatorPlan(creatorId: string): CreatorSubscriptionPlan | null {
  const all = load<Record<string, CreatorSubscriptionPlan>>(KEYS.plans, {});
  return all[creatorId] ?? null;
}

export function setCreatorPlan(
  creatorId: string,
  tierName: string,
  priceMonthly: number,
  description: string,
  benefits: string[]
): CreatorSubscriptionPlan {
  const all = load<Record<string, CreatorSubscriptionPlan>>(KEYS.plans, {});
  const existing = all[creatorId];
  const plan: CreatorSubscriptionPlan = {
    creatorId,
    tierName,
    priceMonthly,
    description,
    benefits,
    active: true,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all[creatorId] = plan;
  save(KEYS.plans, all);
  return plan;
}

// ============================================
// ACCESS CONTROL
// ============================================

export function hasAccessToContent(contentId: string, userId: string | null, creatorId?: string): boolean {
  const pricing = getContentPricing(contentId);
  if (pricing.accessTier === 'free') return true;
  if (!userId) return false;

  if (pricing.accessTier === 'one-time-purchase') {
    const purchases = load<OneTimePurchase[]>(KEYS.purchases, []);
    return purchases.some(p => p.userId === userId && p.contentId === contentId);
  }

  if (pricing.accessTier === 'subscriber-only' || pricing.accessTier === 'premium-tier') {
    if (!creatorId) return false;
    const subs = load<UserSubscription[]>(KEYS.subscriptions, []);
    return subs.some(s => s.userId === userId && s.creatorId === creatorId && s.status === 'active');
  }

  return false;
}

// ============================================
// TRANSACTIONS (single source of truth for revenue)
// ============================================

function recordTransaction(tx: Omit<Transaction, 'id' | 'createdAt' | 'platformFeePercent' | 'platformFeeAmount' | 'creatorPayoutAmount'>): Transaction {
  const config = getPlatformConfig();
  const platformFeeAmount = Math.round(tx.amountGross * (config.platformFeePercent / 100));
  const creatorPayoutAmount = tx.amountGross - platformFeeAmount;

  const full: Transaction = {
    ...tx,
    id: `txn_${crypto.randomUUID()}`,
    platformFeePercent: config.platformFeePercent,
    platformFeeAmount,
    creatorPayoutAmount,
    createdAt: new Date().toISOString(),
  };

  const all = load<Transaction[]>(KEYS.transactions, []);
  all.unshift(full);
  save(KEYS.transactions, all);
  return full;
}

export function getTransactionsForUser(userId: string): Transaction[] {
  return load<Transaction[]>(KEYS.transactions, []).filter(t => t.userId === userId);
}

export function getTransactionsForCreator(creatorId: string): Transaction[] {
  return load<Transaction[]>(KEYS.transactions, []).filter(t => t.creatorId === creatorId);
}

export function getAllTransactions(): Transaction[] {
  return load<Transaction[]>(KEYS.transactions, []);
}

// ============================================
// PURCHASE / SUBSCRIBE FLOWS
// (payment processing itself lives in paymentService.ts)
// ============================================

export function grantOneTimePurchase(
  userId: string,
  userName: string,
  contentId: string,
  contentTitle: string,
  creatorId: string,
  creatorName: string,
  amount: number,
  last4: string
): { purchase: OneTimePurchase; transaction: Transaction } {
  const purchase: OneTimePurchase = {
    id: `purchase_${crypto.randomUUID()}`,
    userId,
    contentId,
    contentTitle,
    amount,
    purchasedAt: new Date().toISOString(),
  };
  const purchases = load<OneTimePurchase[]>(KEYS.purchases, []);
  purchases.unshift(purchase);
  save(KEYS.purchases, purchases);

  const transaction = recordTransaction({
    type: 'one-time-purchase',
    status: 'succeeded',
    userId,
    userName,
    creatorId,
    creatorName,
    contentId,
    contentTitle,
    amountGross: amount,
    last4,
  });

  return { purchase, transaction };
}

export function grantCreatorSubscription(
  userId: string,
  userName: string,
  creatorId: string,
  creatorName: string,
  tierName: string,
  priceMonthly: number,
  last4: string
): { subscription: UserSubscription; transaction: Transaction } {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const subscription: UserSubscription = {
    id: `sub_${crypto.randomUUID()}`,
    userId,
    creatorId,
    creatorName,
    tierName,
    priceMonthly,
    status: 'active',
    startedAt: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
  };

  const subs = load<UserSubscription[]>(KEYS.subscriptions, []);
  // Cancel any existing sub to the same creator first (upgrade/downgrade)
  const filtered = subs.filter(s => !(s.userId === userId && s.creatorId === creatorId));
  filtered.unshift(subscription);
  save(KEYS.subscriptions, filtered);

  const transaction = recordTransaction({
    type: 'subscription',
    status: 'succeeded',
    userId,
    userName,
    creatorId,
    creatorName,
    amountGross: priceMonthly,
    last4,
  });

  return { subscription, transaction };
}

export function getUserSubscriptions(userId: string): UserSubscription[] {
  return load<UserSubscription[]>(KEYS.subscriptions, []).filter(s => s.userId === userId);
}

export function cancelSubscription(subscriptionId: string): UserSubscription | null {
  const subs = load<UserSubscription[]>(KEYS.subscriptions, []);
  const idx = subs.findIndex(s => s.id === subscriptionId);
  if (idx === -1) return null;
  subs[idx] = { ...subs[idx], status: 'canceled', canceledAt: new Date().toISOString() };
  save(KEYS.subscriptions, subs);
  return subs[idx];
}

export function getUserPurchases(userId: string): OneTimePurchase[] {
  return load<OneTimePurchase[]>(KEYS.purchases, []).filter(p => p.userId === userId);
}

// ============================================
// CREATOR EARNINGS
// ============================================

export function getCreatorEarningsSummary(creatorId: string): CreatorEarningsSummary {
  const txns = getTransactionsForCreator(creatorId).filter(t => t.status === 'succeeded');
  const totalGrossRevenue = txns.reduce((sum, t) => sum + t.amountGross, 0);
  const totalPlatformFees = txns.reduce((sum, t) => sum + t.platformFeeAmount, 0);
  const totalNetEarnings = txns.reduce((sum, t) => sum + t.creatorPayoutAmount, 0);

  const payouts = load<PayoutRequest[]>(KEYS.payouts, []).filter(
    p => p.creatorId === creatorId && p.status === 'completed'
  );
  const totalPaidOut = payouts.reduce((sum, p) => sum + p.amount, 0);

  const activeSubs = load<UserSubscription[]>(KEYS.subscriptions, []).filter(
    s => s.creatorId === creatorId && s.status === 'active'
  );

  return {
    creatorId,
    totalGrossRevenue,
    totalPlatformFees,
    totalNetEarnings,
    availableBalance: totalNetEarnings - totalPaidOut,
    totalPaidOut,
    activeSubscriberCount: activeSubs.length,
    totalTransactionCount: txns.length,
  };
}

// ============================================
// PAYOUTS
// ============================================

export function requestPayout(creatorId: string, creatorName: string, amount: number): PayoutRequest {
  const request: PayoutRequest = {
    id: `payout_${crypto.randomUUID()}`,
    creatorId,
    creatorName,
    amount,
    status: 'completed', // demo mode: instant mock payout
    requestedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    method: 'bank_transfer',
  };
  const all = load<PayoutRequest[]>(KEYS.payouts, []);
  all.unshift(request);
  save(KEYS.payouts, all);
  return request;
}

export function getPayoutsForCreator(creatorId: string): PayoutRequest[] {
  return load<PayoutRequest[]>(KEYS.payouts, []).filter(p => p.creatorId === creatorId);
}

// ============================================
// PLATFORM-WIDE STATS (for admin dashboard)
// ============================================

export function getPlatformRevenueStats() {
  const txns = getAllTransactions().filter(t => t.status === 'succeeded');
  const config = getPlatformConfig();
  return {
    totalGrossRevenue: txns.reduce((sum, t) => sum + t.amountGross, 0),
    totalPlatformRevenue: txns.reduce((sum, t) => sum + t.platformFeeAmount, 0),
    totalCreatorPayouts: txns.reduce((sum, t) => sum + t.creatorPayoutAmount, 0),
    totalTransactions: txns.length,
    activeSubscriptions: load<UserSubscription[]>(KEYS.subscriptions, []).filter(s => s.status === 'active').length,
    platformFeePercent: config.platformFeePercent,
  };
}
