import { TelegramClient } from '../bot/telegram';

const MEMBERS = new Set(['member', 'administrator', 'creator']);
export async function isChannelMember(client: TelegramClient, channelId: string, telegramId: string): Promise<boolean> {
  const data = await client.getChatMember(channelId, telegramId);
  return MEMBERS.has(data?.status);
}
