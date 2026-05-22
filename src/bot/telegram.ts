export class TelegramClient {
  constructor(private botToken: string) {}
  private async request(method: string, payload: Record<string, unknown>) {
    const response = await fetch(`https://api.telegram.org/bot${this.botToken}/${method}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (!response.ok) return null;
    const data = await response.json<any>();
    return data.result;
  }
  sendMessage(chatId: number | string, text: string, replyMarkup?: unknown) {
    return this.request('sendMessage', { chat_id: chatId, text, reply_markup: replyMarkup });
  }
  getChatMember(chatId: string, userId: string) { return this.request('getChatMember', { chat_id: chatId, user_id: Number(userId) }); }
}
