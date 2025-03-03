FROM nginx:latest

COPY . /usr/share/nginx/html

RUN sed -i 's/listen  .*/listen 1003;/g' /etc/nginx/conf.d/default.conf