FROM node:18-alpine

WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@15

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start Angular with proxy config
CMD ["ng", "serve", "--host", "0.0.0.0", "--proxy-config", "proxy.conf.json", "--poll=2000"]
