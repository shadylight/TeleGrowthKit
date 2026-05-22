import { ClaimStatus, UserRecord } from '../types';

export async function upsertUser(db: D1Database, user: { telegramId: string; username?: string; firstName?: string; lastName?: string; }): Promise<void> {
  const referralCode = `U${user.telegramId}`;
  await db.prepare(`INSERT INTO users (telegram_id, username, first_name, last_name, referral_code, updated_at)
    VALUES (?1, ?2, ?3, ?4, ?5, CURRENT_TIMESTAMP)
    ON CONFLICT(telegram_id) DO UPDATE SET username=excluded.username, first_name=excluded.first_name, last_name=excluded.last_name, updated_at=CURRENT_TIMESTAMP`)
    .bind(user.telegramId, user.username ?? null, user.firstName ?? null, user.lastName ?? null, referralCode).run();
}
export async function getUserByTelegramId(db:D1Database, telegramId:string){return db.prepare('SELECT * FROM users WHERE telegram_id=?1').bind(telegramId).first<UserRecord>();}
export async function getUserByReferralCode(db:D1Database, code:string){return db.prepare('SELECT * FROM users WHERE referral_code=?1').bind(code).first<UserRecord>();}
export async function addReferral(db:D1Database, referrerId:string, referredId:string, code:string){
  await db.prepare('INSERT OR IGNORE INTO referrals (referrer_telegram_id,referred_telegram_id,referral_code,status) VALUES (?1,?2,?3,\'credited\')').bind(referrerId,referredId,code).run();
}
export async function setReferredByCodeIfNull(db:D1Database, referredId:string, code:string){
  await db.prepare('UPDATE users SET referred_by_code=?1, updated_at=CURRENT_TIMESTAMP WHERE telegram_id=?2 AND referred_by_code IS NULL').bind(code,referredId).run();
}
export async function countReferrals(db:D1Database, telegramId:string){const row=await db.prepare('SELECT COUNT(*) AS c FROM referrals WHERE referrer_telegram_id=?1 AND status=\'credited\'').bind(telegramId).first<{c:number}>();return row?.c ?? 0;}
export async function getClaimByCode(db:D1Database, claimCode:string){return db.prepare('SELECT * FROM claims WHERE claim_code=?1').bind(claimCode).first<any>();}
export async function insertClaim(db:D1Database, claimCode:string, telegramId:string){await db.prepare('INSERT INTO claims (claim_code,telegram_id,status,reward_count) VALUES (?1,?2,\'pending\',1)').bind(claimCode,telegramId).run();}
export async function updateClaimStatus(db:D1Database, claimCode:string, status:ClaimStatus, reviewedBy:string){
  await db.prepare('UPDATE claims SET status=?1, reviewed_at=CURRENT_TIMESTAMP, reviewed_by=?2 WHERE claim_code=?3 AND status=\'pending\'').bind(status,reviewedBy,claimCode).run();
}
export async function incrementClaimedRewards(db:D1Database, telegramId:string, by=1){await db.prepare('UPDATE users SET claimed_rewards=claimed_rewards+?1, updated_at=CURRENT_TIMESTAMP WHERE telegram_id=?2').bind(by,telegramId).run();}
export async function countClaimsByStatus(db:D1Database, telegramId:string, status:ClaimStatus){const r=await db.prepare('SELECT COUNT(*) AS c FROM claims WHERE telegram_id=?1 AND status=?2').bind(telegramId,status).first<{c:number}>();return r?.c??0;}
