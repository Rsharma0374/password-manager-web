# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built files from builder stage (changed from 'build' to 'builder')
COPY --from=builder /app/dist /usr/share/nginx/html/passmanager

# Copy nginx configuration
COPY passmanager.guardianservices.in.conf /etc/nginx/conf.d/passmanager.guardianservices.in.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]