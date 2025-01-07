# Use Node.js as the base image for building the React app
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /password-manager-web

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as the base image for serving the React app
FROM nginx:alpine

# Copy the build output to Nginx's default HTML directory
COPY --from=build /password-manager-web/build /usr/share/nginx/html

# Expose port 80 for the app
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
