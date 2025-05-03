FROM node:20.11.0

WORKDIR /api/
COPY . /api

RUN npm install
RUN npm run build

CMD ["npm", "run", "start:prod"]