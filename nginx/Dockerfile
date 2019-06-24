FROM nginx:1.15.5-alpine
COPY ./config /etc/nginx/
COPY html /usr/share/nginx/html/

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g" , "daemon off;"]