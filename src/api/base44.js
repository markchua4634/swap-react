import { createClient } from '@base44/sdk';

const base44 = createClient({
  appId: '68ede23e0a0ff3d50d9f878f',
});

export const { auth, entities } = base44;

export const {
  Item,
  ExchangeRequest,
  Transaction,
  Order,
  Notification,
  Wishlist,
  Review,
  Category,
  UserAchievement,
  Referral,
  ActivityFeed,
  WeeklyChallenge,
  UserChallengeProgress,
  OrderMessage,
  Dispute,
} = entities;
