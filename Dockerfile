FROM node:latest

MAINTAINER Monish Raaj L

RUN echo "building our node app"

COPY . /var/www

WORKDIR /var/www

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm","start"]