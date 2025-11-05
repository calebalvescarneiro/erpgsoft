FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY package.json ./
RUN pnpm install
COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY public ./public
COPY src ./src
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5173"]
