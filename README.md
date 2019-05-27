# otus-randomization

## Docker-compose
Execute o comando: 
`sudo docker-compose up --build`

## Dockerfile
**MongoDB** (_mongodb folder_)
<br>
Build:
`docker build -t otus-randomization-database .` 
<br>
<br>
Run:
`docker run -p 27017:27017 -v mongoData:/data/db/ --name otus-randomization-database otus-randomization-database`
<br>
<br>
**NodeJS** (_nodejs/api folder_)<br>
Build:
`docker build -t otus-randomization .`
<br>
<br>
Run: 
`docker run -p 80:3001 --name otus-randomization --link otus-randomization-database:otus-randomization-database -e MONGO_USERNAME=admin -e MONGO_PASSWORD=secret -e MONGO_HOSTNAME=otus-randomization-database -e MONGO_PORT=27017 -e MONGO_DB=otus-randomization otus-randomization`