# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Next.js telemetry disable
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY next.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY src ./src

RUN npm run build

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src/app/globals.css ./src/app/globals.css

EXPOSE 3000

CMD ["npm", "start"]
