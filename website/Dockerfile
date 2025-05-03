FROM node:20.11.0

WORKDIR /website
COPY . /website

RUN npm install
RUN npm install -g serve
RUN npm run build

EXPOSE 6013
CMD ["serve", "-s", "dist", "-l", "6013"]