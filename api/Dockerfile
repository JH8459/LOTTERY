FROM node:20.11.0

WORKDIR /api/

COPY ./package*.json /api/

RUN npm install

COPY . /api

RUN npm run build
CMD npm run start:prod

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:3000/health -s -w %{http_code} | grep 200 || kill -9 `pgrep -f "node dist/main"`