# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build args for public variables
ARG PUBLIC_GA_MEASUREMENT_ID
ARG PUBLIC_RECAPTCHA_SITE_KEY
ARG PUBLIC_TURNSTILE_SITE_KEY
ARG PUBLIC_KEYSTATIC_GITHUB_APP_SLUG

# Set public variables as environment variables for build time
ENV PUBLIC_GA_MEASUREMENT_ID=${PUBLIC_GA_MEASUREMENT_ID}
ENV PUBLIC_RECAPTCHA_SITE_KEY=${PUBLIC_RECAPTCHA_SITE_KEY}
ENV PUBLIC_TURNSTILE_SITE_KEY=${PUBLIC_TURNSTILE_SITE_KEY}
ENV PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=${PUBLIC_KEYSTATIC_GITHUB_APP_SLUG}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Accept build args for public variables (should match builder stage)
ARG PUBLIC_GA_MEASUREMENT_ID
ARG PUBLIC_RECAPTCHA_SITE_KEY
ARG PUBLIC_TURNSTILE_SITE_KEY
ARG PUBLIC_KEYSTATIC_GITHUB_APP_SLUG

# Set public variables as environment variables for runtime
ENV PUBLIC_GA_MEASUREMENT_ID=${PUBLIC_GA_MEASUREMENT_ID}
ENV PUBLIC_RECAPTCHA_SITE_KEY=${PUBLIC_RECAPTCHA_SITE_KEY}
ENV PUBLIC_TURNSTILE_SITE_KEY=${PUBLIC_TURNSTILE_SITE_KEY}
ENV PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=${PUBLIC_KEYSTATIC_GITHUB_APP_SLUG}

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/public ./public
COPY --from=builder --chown=astro:nodejs /app/keystatic.config.ts ./keystatic.config.ts

# Switch to non-root user
USER astro

# Expose port (default Astro port, can be overridden with PORT env var)
EXPOSE 4321

# Set environment to production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "dist/server/entry.mjs"]
