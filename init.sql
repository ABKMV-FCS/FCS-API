CREATE DATABASE FCS;
use FCS;
CREATE TABLE user(
	username varchar(50) primary key,
	password varchar(500) not null,
	name varchar(50) not null,
	email varchar(50) not null,
	role varchar(20) not null
);