FROM node:20.11.0

WORKDIR /crawler/

COPY ./package*.json /crawler/

RUN npm install

COPY . /crawler

RUN npm run build
CMD npm run start