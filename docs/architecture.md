# Architecture

TeleGrowthKit uses a Cloudflare Worker as a webhook/API server.

- `src/index.ts`: routing and request validation
- `src/bot/*`: Telegram API and interaction handlers
- `src/services/*`: domain logic (users/referrals/rewards/admin/membership)
- `src/db/queries.ts`: D1 SQL access layer

Data model:
- `users` stores Telegram profile, referral code, reward counters
- `referrals` stores one-time credited referrals
- `claims` stores pending/approved/rejected reward claims
