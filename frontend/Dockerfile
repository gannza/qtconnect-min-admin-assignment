# -------------------------------
# Stage 1: Build React app
# -------------------------------
  FROM node:24-alpine AS builder

  # Set working directory
  WORKDIR /app
  
  # Copy only package files first (for better caching)
  COPY package*.json ./
  
  # Install dependencies with clean cache (cached layer)
  RUN npm install --legacy-peer-deps
  
  # Copy the rest of the source code
  COPY . .
  
  # Environment for production build
  ENV NODE_ENV=production
  ENV VITE_API_URL=http://backend:3000
  
  # Build app
  RUN npm run build
  
  # -------------------------------
  # Stage 2: Production with Nginx
  # -------------------------------
  FROM nginx:alpine
  
  # Copy built assets
  COPY --from=builder /app/dist /usr/share/nginx/html
  
  # Copy protobuf files (if you need to serve them)
  COPY --from=builder /app/src/proto /usr/share/nginx/html/src/proto
  # Copy custom nginx config
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  # Expose port
  EXPOSE 80
  
  # Healthcheck
  HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
  
  CMD ["nginx", "-g", "daemon off;"]  