FROM node:10-alpine
ADD . src/
WORKDIR /src

EXPOSE 8080
ENV MEMORY 2048
CMD node --max-old-space-size=$MEMORY --optimize-for-size app.js



