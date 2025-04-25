FROM node:18
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 10000
CMD ["node", "dist/web-server.js"]