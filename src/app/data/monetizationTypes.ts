/**
 * CREATOR MONETIZATION — TYPE DEFINITIONS
 *
 * Models the revenue-sharing marketplace: creators price their content,
 * viewers subscribe or purchase, and CREOVA retains a configurable
 * platform fee on every transaction.
 */

export type AccessTier = 'free' | 'subscriber-only' | 'one-time-purchase' | 'premium-tier';

export interface ContentPricing {
  contentId: string; // storyWorldId
  accessTier: AccessTier;
  oneTimePrice?: number; // USD cents, used when accessTier === 'one-time-purchase'
  requiresCreatorSubscription?: boolean; // used when accessTier === 'subscriber-only'
  updatedAt: string;
}

export interface CreatorSubscriptionPlan {
  creatorId: string;
  tierName: string; // e.g. "Supporter", "Inner Circle"
  priceMonthly: number; // USD cents
  description: string;
  benefits: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'subscription' | 'one-time-purchase' | 'platform-subscription';
export type TransactionStatus = 'succeeded' | 'failed' | 'refunded' | 'pending';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  userId: string;
  userName: string;
  creatorId?: string;
  creatorName?: string;
  contentId?: string;
  contentTitle?: string;
  amountGross: number; // USD cents, what the user paid
  platformFeePercent: number; // snapshot of the fee rate applied at time of transaction
  platformFeeAmount: number; // USD cents retained by CREOVA
  creatorPayoutAmount: number; // USD cents owed to creator
  createdAt: string;
  refundedAt?: string;
  last4?: string; // mock card last 4 digits
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export interface UserSubscription {
  id: string;
  userId: string;
  creatorId: string;
  creatorName: string;
  tierName: string;
  priceMonthly: number; // USD cents
  status: SubscriptionStatus;
  startedAt: string;
  currentPeriodEnd: string;
  canceledAt?: string;
}

export interface OneTimePurchase {
  id: string;
  userId: string;
  contentId: string;
  contentTitle: string;
  amount: number; // USD cents
  purchasedAt: string;
}

export interface PlatformConfig {
  platformFeePercent: number; // e.g. 15 = CREOVA keeps 15%, creator keeps 85%
  platformSubscriptionPriceMonthly: number; // USD cents, CREOVA's own subscription tier
  minimumPayoutAmount: number; // USD cents
  updatedAt: string;
}

export interface PayoutRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  amount: number; // USD cents
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  method: 'bank_transfer' | 'paypal';
}

export interface CreatorEarningsSummary {
  creatorId: string;
  totalGrossRevenue: number; // USD cents, lifetime
  totalPlatformFees: number; // USD cents, lifetime
  totalNetEarnings: number; // USD cents, lifetime (available + paid out)
  availableBalance: number; // USD cents, not yet paid out
  totalPaidOut: number; // USD cents
  activeSubscriberCount: number;
  totalTransactionCount: number;
}

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  platformFeePercent: 15,
  platformSubscriptionPriceMonthly: 999, // $9.99
  minimumPayoutAmount: 2000, // $20.00
  updatedAt: new Date(0).toISOString(),
};

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
