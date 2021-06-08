FROM node:latest

MAINTAINER Monish Raaj L

COPY . .

WORKDIR .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm","start"]