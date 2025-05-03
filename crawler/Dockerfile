FROM node:20.11.0

WORKDIR /crawler/
COPY . /crawler

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]