FROM node:18-alpine
WORKDIR /app

# 1) Copia e instala deps
COPY package.json pnpm-lock.yaml ./
RUN npm install --omit=dev

# 2) Copia todo y build
COPY . .
RUN npm run build

# 3) Exponer puerto
EXPOSE 10000

# 4) Arrancar
CMD ["npm", "run", "start"]