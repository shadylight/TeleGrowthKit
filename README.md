# TeleGrowthKit

TeleGrowthKit is a professional, open-source starter for Telegram referral workflows built on Cloudflare Workers + D1.
It is designed to be safe to publish, easy to demo, and practical for portfolio/recruiter review.

## What this project does
- Accepts Telegram `/start` with referral payloads.
- Tracks successful referrals with duplicate protection.
- Shows each user their referral progress and reward eligibility.
- Lets users create reward claims when eligible.
- Provides admin endpoints to approve/reject claims.

## Demo flow
1. User starts the bot.
2. User joins required channel (optional gate).
3. User gets personal referral link.
4. Friends join via the link and are credited.
5. User checks **My Status** and sees progress.
6. User taps **Claim Reward** when eligible.
7. Admin reviews the claim via secure endpoints.

## Tech stack
- TypeScript
- Cloudflare Workers
- Cloudflare D1
- Telegram Bot API (webhook mode)
- Wrangler

## Installation (exact commands)
```bash
# 1) Clone
git clone https://github.com/<your-username>/TeleGrowthKit.git
cd TeleGrowthKit

# 2) Install dependencies
npm install

# 3) Create local env file (for local development only)
cp .env.example .env

# 4) Create Wrangler config from example
cp wrangler.toml.example wrangler.toml
```

## Cloudflare D1 setup (exact commands)
```bash
# Create a D1 database
wrangler d1 create telegrowthkit-db

# Apply schema migration
wrangler d1 execute telegrowthkit-db --file=./migrations/0001_initial.sql
```

After creating the DB, copy the returned `database_id` into `wrangler.toml` (or environment-specific Wrangler config).

## Required environment variables
- `BOT_TOKEN`
- `BOT_USERNAME`
- `TELEGRAM_SECRET_TOKEN`
- `ADMIN_API_KEY`
- `ADMIN_TELEGRAM_IDS`
- `PUBLIC_WEBHOOK_URL`
- `REFERRAL_REWARD_THRESHOLD`
- `REQUIRED_CHANNEL_ID` (optional)
- `REQUIRED_CHANNEL_HANDLE` (optional)

## Local development
```bash
npm run dev
```

## Telegram webhook setup (curl example)
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<YOUR_WORKER_DOMAIN>/webhook",
    "secret_token": "<YOUR_TELEGRAM_SECRET_TOKEN>"
  }'
```

## Admin claim review (curl examples)
```bash
# Approve
curl -X POST "https://<YOUR_WORKER_DOMAIN>/admin/claims/CLAIM_ABC12345/approve" \
  -H "x-admin-api-key: <YOUR_ADMIN_API_KEY>"

# Reject
curl -X POST "https://<YOUR_WORKER_DOMAIN>/admin/claims/CLAIM_ABC12345/reject" \
  -H "x-admin-api-key: <YOUR_ADMIN_API_KEY>"
```

## What this project does not include
- No payment processing logic.
- No private business logic.
- No real production tokens, keys, or IDs.
- No customer/private user dataset.

## Portfolio value
This repository demonstrates:
- Serverless backend design on Cloudflare Workers.
- Relational data modeling in D1/SQLite.
- Referral and reward state-machine thinking.
- Basic abuse resistance (duplicate referral/claim controls).
- Secure webhook + admin endpoint patterns.
- Clean TypeScript service layering for maintainability.

## Documentation
- Architecture: `docs/architecture.md`
- Deployment: `docs/deployment.md`
- Telegram setup: `docs/telegram-setup.md`
- Security: `docs/security.md`
- Contributing: `CONTRIBUTING.md`

## License
MIT
