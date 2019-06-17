FROM node:8-alpine
ADD . src/
WORKDIR /src
RUN npm i -g typescript
RUN npm i

EXPOSE 3001
CMD npm run dev