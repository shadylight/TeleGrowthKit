export interface Env {
  BOT_TOKEN?: string;
  BOT_USERNAME?: string;
  REQUIRED_CHANNEL_ID?: string;
  REQUIRED_CHANNEL_HANDLE?: string;
  REFERRAL_REWARD_THRESHOLD?: string;
  TELEGRAM_SECRET_TOKEN?: string;
  ADMIN_TELEGRAM_IDS?: string;
  ADMIN_API_KEY?: string;
  PUBLIC_WEBHOOK_URL?: string;
  DB: D1Database;
}

export interface AppConfig {
  botToken?: string;
  botUsername?: string;
  requiredChannelId?: string;
  requiredChannelHandle?: string;
  rewardThreshold: number;
  telegramSecretToken?: string;
  adminTelegramIds: Set<string>;
  adminApiKey?: string;
  publicWebhookUrl?: string;
}

export interface TelegramUpdate { message?: TelegramMessage; callback_query?: TelegramCallbackQuery; }
export interface TelegramUser { id: number; username?: string; first_name?: string; last_name?: string; }
export interface TelegramChat { id: number; type: string; }
export interface TelegramMessage { message_id: number; text?: string; from?: TelegramUser; chat: TelegramChat; }
export interface TelegramCallbackQuery { id: string; from: TelegramUser; data?: string; message?: TelegramMessage; }

export interface UserRecord {
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  referral_code: string;
  referred_by_code: string | null;
  claimed_rewards: number;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected';
