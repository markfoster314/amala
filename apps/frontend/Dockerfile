# Multi-stage build for production frontend

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate
WORKDIR /app

# Copy package files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY tsconfig.json tsconfig.base.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules

# Copy source code
COPY . .

# Accept build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_AWS_COGNITO_USER_POOL_ID
ARG VITE_AWS_COGNITO_CLIENT_ID
ARG VITE_AWS_REGION

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AWS_COGNITO_USER_POOL_ID=$VITE_AWS_COGNITO_USER_POOL_ID
ENV VITE_AWS_COGNITO_CLIENT_ID=$VITE_AWS_COGNITO_CLIENT_ID
ENV VITE_AWS_REGION=$VITE_AWS_REGION

# Build the frontend
WORKDIR /app/apps/frontend
RUN pnpm build

# Stage 3: Production
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy built assets from builder
COPY --from=builder /app/apps/frontend/dist .

# Copy nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
