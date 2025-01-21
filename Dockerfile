
# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY dist /usr/share/nginx/html/passmanager

# Expose the default Nginx port
EXPOSE 80
