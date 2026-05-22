# TeleGrowthKit

TeleGrowthKit is an open-source starter kit for running Telegram referral campaigns on Cloudflare Workers and D1.

## Why this exists
A clean, portfolio-friendly baseline for developers who need a secure, serverless referral bot without private business logic.

## Features
- `/start` onboarding with referral payload support
- Optional required-channel membership gate
- Personal referral links and status tracking
- Claim generation and admin review endpoints
- Cloudflare D1 schema with anti-duplicate referral constraints

## Architecture overview
- Worker handles HTTP routes and webhook updates
- Bot handlers process commands/callbacks
- Services contain referral/reward/admin logic
- D1 stores users, referrals, and claims

See `docs/architecture.md` for details.

## Tech stack
- Cloudflare Workers
- Cloudflare D1
- TypeScript
- Wrangler
- Telegram Bot API (webhook)

## Quick start
1. Copy `.env.example` values into Wrangler secrets/env vars.
2. Copy `wrangler.toml.example` to `wrangler.toml` and set D1 IDs.
3. Install deps: `npm install`
4. Run local dev: `npm run dev`

## Environment variables
`BOT_TOKEN`, `BOT_USERNAME`, `REQUIRED_CHANNEL_ID`, `REQUIRED_CHANNEL_HANDLE`, `REFERRAL_REWARD_THRESHOLD`, `TELEGRAM_SECRET_TOKEN`, `ADMIN_TELEGRAM_IDS`, `ADMIN_API_KEY`, `PUBLIC_WEBHOOK_URL`.

## D1 setup
- Create DB: `wrangler d1 create telegrowthkit-db`
- Apply migration: `wrangler d1 execute telegrowthkit-db --file=./migrations/0001_initial.sql`

## Telegram webhook setup
- Set webhook URL to `${PUBLIC_WEBHOOK_URL}/webhook`
- Optionally include secret token header verification

## Bot flow
Start -> join/check channel -> share referral link -> track status -> claim reward.

## Admin claim flow
Admin calls:
- `POST /admin/claims/:claimCode/approve`
- `POST /admin/claims/:claimCode/reject`
with `x-admin-api-key` header.

## Security notes
- Never commit tokens, IDs, or admin keys
- Use Wrangler secrets for sensitive values
- Validate webhook secret token when enabled

## Roadmap
- Add Telegram inline admin moderation actions
- Add analytics endpoints
- Add localization support

## License
MIT
