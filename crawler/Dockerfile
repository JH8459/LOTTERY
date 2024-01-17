FROM node:20.11.0

WORKDIR /crawler/

COPY ./package*.json /crawler/

RUN npm install

COPY . /crawler

CMD npm run start

HEALTHCHECK --interval=30s --timeout=2s --retries=1 \
  CMD curl -f http://localhost:3000/health -s -w %{http_code} | grep 200 || kill -9 `pgrep -f "nodemon app.js"`