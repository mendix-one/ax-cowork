# Example env for the `di` deployable (ax-data-integration).
# Copy to deploy/.env.di and adjust for your environment. The package ships its own
# .env.compose.example — keep this file in sync if you add new vars there.

NODE_ENV=production
PORT=15001

MONGODB_URI=mongodb://ax:replace-with-strong-password@mongo:27017/ax-di?authSource=admin
