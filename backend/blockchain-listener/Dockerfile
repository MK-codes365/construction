# Dockerfile for blockchain-listener
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy source
COPY . .

# Expose port
EXPOSE 4001

# Default envs can be overridden by the host
ENV PORT=4001

CMD [ "node", "index.js" ]
