import { countClaimsByStatus, countReferrals, getUserByTelegramId, insertClaim } from '../db/queries';

export async function getRewardStatus(db: D1Database, telegramId: string, threshold: number) {
  const referrals = await countReferrals(db, telegramId);
  const user = await getUserByTelegramId(db, telegramId);
  const claimed = user?.claimed_rewards ?? 0;
  const claimable = Math.max(0, Math.floor(referrals / threshold) - claimed);
  const approvedClaims = await countClaimsByStatus(db, telegramId, 'approved');
  return { referrals, claimed, claimable, approvedClaims };
}

export async function createClaimIfAvailable(db: D1Database, telegramId: string, threshold: number): Promise<string | null> {
  const { claimable } = await getRewardStatus(db, telegramId, threshold);
  if (claimable <= 0) return null;
  const claimCode = `CLAIM_${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  await insertClaim(db, claimCode, telegramId);
  return claimCode;
}
