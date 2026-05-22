import { getClaimByCode, incrementClaimedRewards, updateClaimStatus } from '../db/queries';

export async function reviewClaim(db:D1Database, claimCode:string, status:'approved'|'rejected', reviewedBy:string){
  const claim = await getClaimByCode(db, claimCode);
  if (!claim) return { ok:false, reason:'not_found' };
  if (claim.status !== 'pending') return { ok:false, reason:'already_reviewed', claim };
  await updateClaimStatus(db, claimCode, status, reviewedBy);
  if (status === 'approved') await incrementClaimedRewards(db, claim.telegram_id, claim.reward_count);
  return { ok:true };
}
