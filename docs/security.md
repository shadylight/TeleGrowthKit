# Security

- Store `BOT_TOKEN`, `ADMIN_API_KEY`, and webhook secret in Wrangler secrets.
- Never commit `.env` with real values.
- Validate Telegram secret header on `/webhook` when configured.
- Protect admin claim endpoints with strong random `ADMIN_API_KEY`.
- Limit D1 access to Worker binding and avoid external exposure.
- Do not include customer data, private URLs, or business logic in public repos.

## Production hardening
- Rate limit `/webhook` and `/admin/*` endpoints to reduce automated abuse.
- Rotate `BOT_TOKEN`, `ADMIN_API_KEY`, and webhook secret immediately if leakage is suspected.
- Avoid committing `wrangler.toml` with sensitive real database IDs in private/internal environments.
- Validate Telegram secret token on every webhook call.
- Restrict admin endpoints with strong API keys and scoped access controls.
- Monitor abuse patterns (sudden claim spikes, repeated failures, unusual referral bursts).
