FROM node:20.11.0

WORKDIR /api/

COPY ./package*.json /api/

RUN npm install --force

COPY . /api

CMD npm run start:dev

HEALTHCHECK --interval=30s --timeout=2s --retries=3 \
    CMD curl -f http://localhost:3000/health -s -w %{http_code} | grep 200 || kill -9 `pgrep -f "nest start --watch"`