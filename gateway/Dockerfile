FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our master config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose Port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
