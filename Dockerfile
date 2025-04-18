# Stage 1: Build frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy the built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script for injecting environment variables
COPY entrypoint /entrypoint
COPY .env.example /app/.env.example
RUN chmod +x /entrypoint

# Start using the entrypoint
ENTRYPOINT ["/entrypoint"]

# Example run command:
# docker build -t chat-frontend .
# docker run -it -p 8080:80 \
#   -e VITE_API_BASE_URL=http://localhost:4000/api \
#   -e VITE_SOCKET_BASE_URL=http://localhost:4000/ \
#   -e VITE_ERROR_TRACKING_ENABLED=true \
#   -e VITE_ERROR_TRACKING_URL=http://localhost:4000/errors/ \
#   chat-frontend