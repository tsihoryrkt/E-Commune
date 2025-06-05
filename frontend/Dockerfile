# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the builder stage to Nginx's web root directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Nginx will automatically start and serve files from /usr/share/nginx/html
# The default nginx.conf should be sufficient for a standard Create React App.
# CMD is not strictly necessary here as the base nginx image has a default CMD.
# However, if you needed to customize, it would be like:
# CMD ["nginx", "-g", "daemon off;"]
