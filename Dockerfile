FROM node:16-alpine

WORKDIR /usr/src/app

COPY . .
RUN npm ci

RUN cd ./server && npm ci

RUN cd ..

EXPOSE $PORT
CMD [ "npm", "start" ]