FROM nginx:1.23.1
#ADD nginx.conf  /usr/nginx/conf/http_vhost/
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html
