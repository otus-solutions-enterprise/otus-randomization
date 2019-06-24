# otus-randomization
### MongoDB
**Path (container) Config:** _/opt/bitnami/mongodb/conf/mongodb.conf_
<br>
**Path (container) Data:** _/bitnami/mongodb/data/db_

### NodeJS
**Path Application API:** _./nodejs/api/_

### NGINX
**Path Application Front-end:** _./nginx/html/_

## Docker-compose
Execute o comando: 
`sudo docker-compose up --build`

## Dockerfile
**MongoDB** (_mongodb folder_)
<br>
Build:
`docker build -t otus-randomization-db .` 
<br>
<br>
Run:
`docker run -p 27017:27017 -v $(pwd)/mongoData:/data/db/ --name otus-randomization-db otus-randomization-db`
<br>
<br>
**NodeJS** (_nodejs/api folder_)<br>
Build:
`docker build -t otus-randomization .`
<br>
<br>
Run: 
`docker run -p 80:8080 --name otus-randomization --link otus-randomization-db:otus-randomization-db -e MONGO_USERNAME=admin -e MONGO_PASSWORD=secret -e MONGO_HOSTNAME=otus-randomization-db -e MONGO_PORT=27017 -e MONGO_DB=otus-randomization otus-randomization`