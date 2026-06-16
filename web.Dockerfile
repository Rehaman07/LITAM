# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy configuration and package details from the frontend folder
COPY frontend/package*.json /app/

RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ /app/

# Build React + TypeScript + Tailwind
RUN npm run build

# Serve Stage
FROM nginx:alpine

# Copy built frontend assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
