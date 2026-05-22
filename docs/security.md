# Security

- Store `BOT_TOKEN`, `ADMIN_API_KEY`, and webhook secret in Wrangler secrets.
- Never commit `.env` with real values.
- Validate Telegram secret header on `/webhook` when configured.
- Protect admin claim endpoints with strong random `ADMIN_API_KEY`.
- Limit D1 access to Worker binding and avoid external exposure.
- Do not include customer data, private URLs, or business logic in public repos.
