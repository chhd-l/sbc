FROM nginx:1.20.2
#ADD nginx.conf  /usr/nginx/conf/http_vhost/
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html
