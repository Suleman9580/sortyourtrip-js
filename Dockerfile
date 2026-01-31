# FROM node:20-alpine AS builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY tsconfig.json ./
# COPY src ./src
# RUN npm run build

# FROM node:20-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --production
# COPY --from=builder /app/dist ./dist
# COPY model ./model

# EXPOSE 3000
# CMD ["node", "dist/api/server.js"]


FROM node:20-bullseye AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-bullseye
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY model ./model

EXPOSE 3000
CMD ["node", "dist/api/server.js"]
