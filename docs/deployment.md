# Deployment (Cloudflare Workers + D1)

1. Install Wrangler and login: `npx wrangler login`
2. Create D1 DB and wire `database_id` in `wrangler.toml`
3. Run migration with `wrangler d1 execute ... --file migrations/0001_initial.sql`
4. Set secrets (`BOT_TOKEN`, `ADMIN_API_KEY`, etc.) via `wrangler secret put`
5. Deploy: `npm run deploy`
6. Configure Telegram webhook to `https://<worker-domain>/webhook`
