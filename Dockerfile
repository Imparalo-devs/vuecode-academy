# ⚠️ VueCode Academy - Intentionally vulnerable Dockerfile
# This Dockerfile demonstrates common DevOps mistakes

# VULNERABILITY: Using latest tag - non-deterministic builds
FROM node:latest

# VULNERABILITY: Running as root user
# Should use: USER node

# VULNERABILITY: No .dockerignore - copies everything including .env and node_modules
COPY . /app

WORKDIR /app

# VULNERABILITY: Installing all dependencies including devDependencies in production
RUN npm install

# VULNERABILITY: Exposing unnecessary ports
EXPOSE 3000
EXPOSE 9229

# VULNERABILITY: No health check
# VULNERABILITY: Running as root
# VULNERABILITY: No resource limits defined here

# VULNERABILITY: Secrets in environment variables visible in image layers
ENV JWT_SECRET=superSecret123
ENV ADMIN_PASSWORD=admin123
ENV API_KEY=sk-academy-hardcoded-key

# VULNERABILITY: Using npm start instead of node directly (adds unnecessary process)
CMD ["npm", "start"]
