FROM node:18-alpine AS base

    RUN apk add --no-cache libc6-compat

    WORKDIR /app
    
    ENV NODE_ENV=production

    # Install pnpm globally
    RUN corepack enable && corepack prepare pnpm@latest --activate    

FROM base AS builder

    COPY . .

    # Install dependencies
    RUN pnpm install --frozen-lockfile

    # Apply production DB migrations
    RUN pnpm exec prisma generate
    RUN pnpm exec prisma migrate deploy

    # Build Next.js
    RUN pnpm build

FROM base AS runner

    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/prisma ./prisma

    EXPOSE 3000

    CMD ["pnpm", "start"]