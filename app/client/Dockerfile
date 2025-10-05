FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:alpine
WORKDIR /usr/app
COPY --from=build /app/dist/client ./
EXPOSE 4000
CMD ["node",  "server/server.mjs"]