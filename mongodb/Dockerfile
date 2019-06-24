FROM mongo:4.0
COPY ./config/mongo.conf /etc/mongo.conf
EXPOSE 27017
CMD ["mongod","--auth","-f", "/etc/mongo.conf"]
