# Builder stage
FROM node:18-alpine as builder

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install


# Runner Stage
FROM node:18-alpine as app

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Load app dependencies
COPY --from=builder /app/node_modules /app/node_modules
COPY . .


EXPOSE 3000
CMD "sh" "-c" "npm run build && npm run dev"

