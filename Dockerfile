FROM node:21 as base
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:21 as final
WORKDIR /app
COPY --from=base /app/dist ./dist
COPY package.json .
COPY package-lock.json .
RUN npm ci
EXPOSE 3000
CMD ["node", "dist/server.js"]