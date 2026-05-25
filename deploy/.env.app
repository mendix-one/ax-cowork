# Example env for the `app` deployable (ax-coworker-be serving the UI bundle).
# Copy to deploy/.env.app and ROTATE the secrets below before any production use —
# values here are committed to git and must be considered public.

NODE_ENV=production
PORT=15000

# SSO upstream the BE talks to. The compose-network hostname `amz-cowork-sso` resolves
# to the sso container when both run on the same docker-compose network.
SSO_BASE_URL=http://10.0.0.20:15501
SSO_APP_KEY=APLANNER

# Must appear in the sso service's API_KEYS list. Keep in sync with deploy/.env.sso.
SSO_API_KEY=08fd4d0919a32441e2f119515d0ab468e1efca539d4ed73f7ed643c2359ed63d

# Must equal the sso service's JWT_SECRET — BE verifies tokens locally without re-calling SSO.
SSO_JWT_SECRET=ac6bb1c78fc5a48c3d82cf4edd4479671446690d1023d47c57462d9b4d26a491

# Session cookie crypto (AES-256-GCM). 64 hex chars = 32 bytes.
# Regenerate per environment: `openssl rand -hex 32`
SESSION_COOKIE_NAME=ax_aplanner
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SECRET=8ab4bae7d97451be8600a8cff62601a49e894d95fc6ee4f6c601a62bac00f0a6

# Gateway upstream map (JSON). Each entry routes `/app/<key>/...` to that baseURL,
# with `appKey` used as the scope when minting upstream tokens via SSO /token.
GATEWAY_SERVICES={"sso":{"baseURL":"http://10.0.0.20:15501","appKey":"SSO"}}
