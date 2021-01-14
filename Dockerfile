FROM nginx:1.18.0
#ADD nginx.conf  /usr/nginx/conf/http_vhost/
COPY dist/ /usr/share/nginx/html
