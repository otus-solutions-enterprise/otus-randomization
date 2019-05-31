FROM node:8-alpine
ADD . src/
WORKDIR /src
RUN npm i -g typescript
RUN npm i

EXPOSE 8080
CMD npm run dev