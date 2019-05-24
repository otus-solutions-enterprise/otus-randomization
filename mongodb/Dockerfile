FROM mongo:4.0
ADD ./config/mongo.conf /etc/mongo.conf
ADD ./config/initdb.js /docker-entrypoint-initdb.d/initdb.js
#RUN mongod --dbpath /data/db
CMD ["mongod","--auth","-f", "/etc/mongo.conf"]