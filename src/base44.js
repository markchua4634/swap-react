import { createClient, getAccessToken, saveAccessToken, removeAccessToken } from '@base44/sdk';

const base44 = createClient({
  appId: '69b90fd2e29285ce5a154ddc',
  appBaseUrl: 'https://base44.app',
});

export default base44;
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

export { getAccessToken, saveAccessToken, removeAccessToken };
