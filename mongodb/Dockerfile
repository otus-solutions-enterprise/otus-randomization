FROM mongo:4.0
COPY ./config/mongo.conf /etc/mongo.conf
COPY ./config/initdb.js /docker-entrypoint-initdb.d/initdb.js
EXPOSE 27017
CMD ["mongod","--auth","-f", "/etc/mongo.conf"]