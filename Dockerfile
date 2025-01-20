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

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]