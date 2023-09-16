FROM node:latest

RUN mkdir myapp

WORKDIR myapp

ADD app.js /app.js

ENTRYPOINT ["node", "app.js"]

