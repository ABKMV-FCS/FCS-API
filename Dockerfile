FROM node:latest

MAINTAINER Monish Raaj L

COPY . /var/www

WORKDIR /var/www

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm","start"]
