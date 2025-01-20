FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Create directory for the app
RUN mkdir -p /usr/share/nginx/html/passmanager

# Copy the built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html/passmanager

# Set proper permissions
#RUN chown -R jenkins:jenkins /usr/share/nginx/html/passmanager

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]