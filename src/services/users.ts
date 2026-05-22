import { upsertUser, getUserByTelegramId } from '../db/queries';
import { TelegramUser } from '../types';

export async function ensureUser(db: D1Database, user: TelegramUser): Promise<string> {
  const telegramId = String(user.id);
  await upsertUser(db, { telegramId, username: user.username, firstName: user.first_name, lastName: user.last_name });
  return telegramId;
}

export { getUserByTelegramId };
