# syntax=docker/dockerfile:1

# Build the Angular frontend
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency definitions first so Docker can cache npm install
COPY package.json package-lock.json ./

# Install the exact versions from package-lock.json
RUN npm ci

# Copy the remaining source files
COPY . .

# Build Angular for production
RUN npm run build

# Serve the compiled Angular frontend
FROM nginx:alpine

# Remove Nginx's default website
RUN rm -rf /usr/share/nginx/html/*

# Copy the Angular browser build into Nginx
#
# Replace "pppoverlay" with the output folder created inside /app/dist
COPY --from=build /app/dist/pppoverlay/browser /usr/share/nginx/html

# Add the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]