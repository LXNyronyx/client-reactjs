# Stage 1: Build the React application using Node.js
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies cleanly using npm ci
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application for production (generates the 'dist' folder)
RUN npm run build

# Stage 2: Serve the built application using Nginx
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx's default public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Create a custom Nginx configuration to support React Router (SPA fallback to index.html)
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server in the foreground
CMD ["nginx", "-g", "daemon off;"]
