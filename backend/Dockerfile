# Use Node.js 24 base image
FROM node:24.3.0

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install build tools for better-sqlite3 (required for compilation)
RUN apt-get update && apt-get install -y g++ make python3

# Install production dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Ensure SQLite database directory exists with proper permissions
RUN mkdir -p data && chmod 755 data && \
    mkdir -p logs && chmod 755 logs

# Expose app port
EXPOSE 3000

# Run migrations and seeds before starting the app
CMD ["sh", "-c", "npm run migrate && npm run seed && npm start"]