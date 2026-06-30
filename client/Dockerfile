# ─── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .

# Pass the API base URL at build time (Vite bakes env vars into the bundle)
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ─── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Custom nginx config for SPA routing (react-router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]