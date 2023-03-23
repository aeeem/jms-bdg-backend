FROM node:16-alpine
WORKDIR /
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
RUN ls -lah
EXPOSE 8080
CMD yarn start
