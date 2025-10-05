# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy the source code
COPY . .

# Compile TypeScript -> JavaScript
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine

WORKDIR /app

# Copy only production deps
COPY package*.json ./
RUN npm install --only=production

# Copy compiled JS from build stage
COPY --from=build /app/build ./dist

# Expose the backend port (adjust if not 3000)
EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/server.js"]