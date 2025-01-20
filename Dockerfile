# Dockerfile for first app (Pass Manager)
# Build stage
FROM node:18-alpine as build-passmanager

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Production stage
FROM nginx:alpine

# Copy the built files from both build stages
COPY --from=build-passmanager /app/dist /usr/share/nginx/html/passmanager

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]