FROM mongo:4.0
COPY ./persistence/mongo.conf /etc/mongo.conf
COPY ./persistence/initdb.js /docker-entrypoint-initdb.d/initdb.js

EXPOSE 27017
CMD ["mongod","--auth","-f", "/etc/mongo.conf"]