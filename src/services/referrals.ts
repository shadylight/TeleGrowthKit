import { addReferral, getUserByReferralCode, setReferredByCodeIfNull } from '../db/queries';

export async function processReferral(db: D1Database, referredTelegramId: string, referralCode: string): Promise<boolean> {
  const referrer = await getUserByReferralCode(db, referralCode);
  if (!referrer || referrer.telegram_id === referredTelegramId) return false;
  await addReferral(db, referrer.telegram_id, referredTelegramId, referralCode);
  await setReferredByCodeIfNull(db, referredTelegramId, referralCode);
  return true;
}
