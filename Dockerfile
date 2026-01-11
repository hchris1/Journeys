FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY src ./src
COPY scripts ./scripts
COPY public ./public
COPY next.config.ts tsconfig.json postcss.config.mjs ./

# Create empty content dir
RUN mkdir -p content/journeys

# Build Next.js
RUN npm run build

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
