# Stage 1: Build the React App
FROM node:18 AS builder

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Ensure the correct deployment directory
RUN mkdir -p /usr/share/nginx/html/passmanager

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html/passmanager

# Expose the default Nginx port
EXPOSE 81

CMD ["nginx", "-g", "daemon off;"]
