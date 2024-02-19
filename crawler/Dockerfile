FROM node:20.11.0

WORKDIR /crawler/

COPY ./package*.json /crawler/

RUN npm install

COPY . /crawler

RUN npm run build
CMD npm run start

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:4000/health -s -w %{http_code} | grep 200 || kill -9 `pgrep -f "node ./dist/index.js"`