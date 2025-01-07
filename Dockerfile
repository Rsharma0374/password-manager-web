# Use an official Nginx image as a base image
FROM nginx:alpine

# Set working directory to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy React build files to Nginx HTML directory
COPY build/ .

# Expose port 80 for the container
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
