import { AppConfig, Env } from './types';

export function getConfig(env: Env): AppConfig {
  const threshold = Number.parseInt(env.REFERRAL_REWARD_THRESHOLD ?? '10', 10);
  return {
    botToken: env.BOT_TOKEN,
    botUsername: env.BOT_USERNAME,
    requiredChannelId: env.REQUIRED_CHANNEL_ID,
    requiredChannelHandle: env.REQUIRED_CHANNEL_HANDLE,
    rewardThreshold: Number.isFinite(threshold) && threshold > 0 ? threshold : 10,
    telegramSecretToken: env.TELEGRAM_SECRET_TOKEN,
    adminTelegramIds: new Set((env.ADMIN_TELEGRAM_IDS ?? '').split(',').map((x) => x.trim()).filter(Boolean)),
    adminApiKey: env.ADMIN_API_KEY,
    publicWebhookUrl: env.PUBLIC_WEBHOOK_URL
  };
}
