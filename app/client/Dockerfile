FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./

ARG BACKEND_BASE

RUN sed -i "s|BACKEND_BASE_PLACEHOLDER|${BACKEND_BASE}|g" src/environments/environment.ts

RUN npm run build

FROM node:alpine
WORKDIR /usr/app
COPY --from=build /app/dist/client ./
EXPOSE 4000
CMD ["node",  "server/server.mjs"]