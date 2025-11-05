FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY package.json ./
RUN pnpm install
COPY tsconfig.json ./
COPY src ./src
CMD ["pnpm", "start"]
