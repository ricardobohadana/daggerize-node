FROM node:21 as base
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:21 as final
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=base /app/dist ./dist
COPY package.json .
COPY package-lock.json .
RUN npm ci --production
EXPOSE 3000
CMD ["node", "dist/server.js"]