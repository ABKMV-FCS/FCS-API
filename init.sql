CREATE DATABASE FCS;
use FCS;
CREATE TABLE user(
	username varchar(50) primary key,
	password varchar(500) not null,
	email varchar(50) not null,
	role varchar(20) not null
);
create table subjectshandled(
faculty_username varchar(200),
coursecodes varchar(255),
primary key(faculty_username)
);
create table examslots(
startdatetime varchar(100),enddatetime varchar(100),subject varchar(100),sem varchar(100),faculty varchar(100),type varchar(100),academicyear varchar(100),dep varchar(100),
primary key(startdatetime,enddatetime,subject,sem,type,academicyear,dep)
);
create table facultych(
faculty varchar(100),day varchar(100),slot varchar(100),dept varchar(100), class varchar(100),sem varchar(100),	academic_year varchar(100),
primary key(day,slot,dept,class,sem,academic_year)
);
create table profile(
faculty_username varchar(100),profilephoto varchar(100),qualifications varchar(100),
primary key(faculty_username)
);
create table profilechangerequests(
faculty_username varchar(200),
profilephoto varchar(100),
qualifications varchar(100),
phone varchar(100),
name varchar(100),	
isactive varchar(100),
email varchar(100),
coursecodes varchar(255),
primary key(faculty_username)
);

