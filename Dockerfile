# Use Node.js as the base image for building the React app
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

COPY .env.production /app/.env.production

# Build the React app using Vite
RUN npm run build -- --mode production

# List the contents of the dist directory to verify build output
RUN ls -l /app/dist

# Use Nginx as the base image for serving the React app
FROM nginx:alpine

# Copy the build output from the build stage to Nginx's default HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the app
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
