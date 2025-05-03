FROM node:20.11.0

WORKDIR /website

COPY ./package*.json /website/

RUN npm install

COPY . /website

RUN npm run build
EXPOSE 6013
CMD ["npm", "run", "preview", "--", "--port", "6013"]