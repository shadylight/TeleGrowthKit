import { getConfig } from './config';
import { handleTelegramUpdate } from './bot/handlers';
import { json } from './utils/response';
import { safeEquals } from './utils/security';
import { Env, TelegramUpdate } from './types';
import { reviewClaim } from './services/admin';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const config = getConfig(env);

    if (request.method === 'GET' && url.pathname === '/') return json({ ok: true, name: 'TeleGrowthKit', version: '0.1.0' });

    if (request.method === 'POST' && url.pathname === '/webhook') {
      if (config.telegramSecretToken) {
        const header = request.headers.get('x-telegram-bot-api-secret-token') ?? '';
        if (!safeEquals(header, config.telegramSecretToken)) return json({ ok: false, error: 'unauthorized' }, 401);
      }
      const update = (await request.json().catch(() => null)) as TelegramUpdate | null;
      if (!update) return json({ ok: false, error: 'invalid_update' }, 400);
      await handleTelegramUpdate(update, env.DB, config);
      return json({ ok: true });
    }

    if (request.method === 'GET' && url.pathname === '/setup') {
      const ready = Boolean(config.botToken && config.publicWebhookUrl);
      return json({
        ok: true,
        automatic_setup_ready: ready,
        manual_instructions: 'Run setWebhook with your BOT_TOKEN and this endpoint: {PUBLIC_WEBHOOK_URL}/webhook plus optional secret token.',
        webhook_url: config.publicWebhookUrl ? `${config.publicWebhookUrl}/webhook` : null
      });
    }

    const claimMatch = url.pathname.match(/^\/admin\/claims\/(CLAIM_[A-Z0-9]+)\/(approve|reject)$/);
    if (request.method === 'POST' && claimMatch) {
      const apiKey = request.headers.get('x-admin-api-key') ?? '';
      if (!config.adminApiKey || !safeEquals(apiKey, config.adminApiKey)) return json({ ok: false, error: 'unauthorized' }, 401);
      const result = await reviewClaim(env.DB, claimMatch[1], claimMatch[2] === 'approve' ? 'approved' : 'rejected', 'admin_api');
      return json(result, result.ok ? 200 : 400);
    }

    return json({ ok: false, error: 'not_found' }, 404);
  }
};
