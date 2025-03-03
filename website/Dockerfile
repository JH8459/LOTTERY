FROM nginx:latest

COPY . /usr/share/nginx/html

RUN sed -i 's/listen  .*/listen 6013;/g' /etc/nginx/conf.d/default.conf