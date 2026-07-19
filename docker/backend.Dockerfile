# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Remove development dependencies
RUN npm prune --production

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
