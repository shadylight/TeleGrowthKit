import { AppConfig, TelegramUpdate } from '../types';
import { TelegramClient } from './telegram';
import { ensureUser, getUserByTelegramId } from '../services/users';
import { processReferral } from '../services/referrals';
import { createClaimIfAvailable, getRewardStatus } from '../services/rewards';
import { isChannelMember } from '../services/membership';
import { getClaimByCode } from '../db/queries';
import { mainKeyboard } from './keyboards';
import { messages } from './messages';

export async function handleTelegramUpdate(update: TelegramUpdate, db: D1Database, config: AppConfig): Promise<void> {
  if (!config.botToken) return;
  const client = new TelegramClient(config.botToken);
  const message = update.message ?? update.callback_query?.message;
  const sender = update.message?.from ?? update.callback_query?.from;
  if (!message || !sender) return;

  const telegramId = await ensureUser(db, sender);
  if (update.message?.text?.startsWith('/start')) {
    const payload = update.message.text.split(' ')[1];
    if (payload?.startsWith('REF_')) await processReferral(db, telegramId, payload.replace('REF_', ''));
    if (payload?.startsWith('CLAIM_') && config.adminTelegramIds.has(telegramId)) {
      const claim = await getClaimByCode(db, payload);
      const user = claim ? await getUserByTelegramId(db, claim.telegram_id) : null;
      await client.sendMessage(message.chat.id, claim ? `Claim ${claim.claim_code}\nUser: ${claim.telegram_id} (@${user?.username ?? 'n/a'})\nStatus: ${claim.status}\nCreated: ${claim.created_at}\nReview via admin endpoints.` : 'Claim not found.');
      return;
    }
    await client.sendMessage(message.chat.id, messages.welcome, mainKeyboard());
    return;
  }

  const action = update.callback_query?.data;
  if (!action) return;
  if (action === 'help') return void (await client.sendMessage(message.chat.id, messages.help));

  if (action === 'check_membership') {
    if (!config.requiredChannelId) return void (await client.sendMessage(message.chat.id, 'Membership gate is disabled.'));
    const ok = await isChannelMember(client, config.requiredChannelId, telegramId);
    await client.sendMessage(message.chat.id, ok ? '✅ Membership verified.' : `❌ Please join ${config.requiredChannelHandle ?? 'the required channel'} first.`);
    return;
  }
  if (action === 'my_referral_link') {
    const user = await getUserByTelegramId(db, telegramId);
    const username = config.botUsername ?? 'your_bot_username';
    const link = `https://t.me/${username}?start=REF_${user?.referral_code ?? `U${telegramId}`}`;
    await client.sendMessage(message.chat.id, `Your referral link:\n${link}\n\nShare text:\nJoin via my link and help me unlock rewards!`);
    return;
  }
  if (action === 'my_status') {
    const membership = config.requiredChannelId ? await isChannelMember(client, config.requiredChannelId, telegramId) : null;
    const status = await getRewardStatus(db, telegramId, config.rewardThreshold);
    const remaining = Math.max(0, config.rewardThreshold - (status.referrals % config.rewardThreshold || config.rewardThreshold));
    await client.sendMessage(message.chat.id, `Referrals: ${status.referrals}\nThreshold: ${config.rewardThreshold}\nRemaining: ${status.claimable > 0 ? 0 : remaining}\nClaimable rewards: ${status.claimable}\nClaimed rewards: ${status.claimed}\nMembership: ${membership === null ? 'Disabled' : membership ? 'Member' : 'Not a member'}`);
    return;
  }
  if (action === 'claim_reward') {
    const claimCode = await createClaimIfAvailable(db, telegramId, config.rewardThreshold);
    await client.sendMessage(message.chat.id, claimCode ? `Reward claim created.\nClaim code: ${claimCode}\nShare this code with admin/support.` : 'No claimable rewards yet. Invite more friends to unlock your next reward.');
  }
}
