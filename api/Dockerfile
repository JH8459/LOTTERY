FROM node:20.11.0

WORKDIR /api/

COPY ./package*.json /api/

RUN npm install

COPY . /api

RUN npm run build
CMD npm run start:prod