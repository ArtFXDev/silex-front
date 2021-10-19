FROM node:16.10 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY . ./
RUN yarn build

FROM nginx
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]