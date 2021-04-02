CREATE DATABASE FCS;

use FCS;

drop table timetable;
drop table active_sem;
drop table dep_duration;
drop table exam_slot;
drop table event;
drop table holiday;
drop table holiday_template;
drop table user;
drop table calendar;
drop table faculty_subject;
drop table sem_timing;
drop table subjects_handled;
drop table course;
drop table dept_class;
drop table profilechangerequest;


CREATE TABLE user(
	username varchar(50) primary key,
	password varchar(500) not null,
	email varchar(50) not null,
	role varchar(20) not null,
	phone varchar(10) not null,
	name varchar(100) not null,
	isactive varchar(5) not null,
	profilephoto varchar(500),
	qualifications varchar(500)
);

create table timetable(
	slot int not null,
	day varchar(3) not null,
	coursecode varchar(10) not null,
	class varchar(5) not null,
	dept varchar(10) not null,
	sem int not null,
	academic_year int not null,
	primary key(slot,day,coursecode,class,dept,sem,academic_year)
);

create table active_sem(
	odd int not null,
	academic_year int not null
);

create table dep_duration(
	dept varchar(10) not null,
	sems int not null,
	primary key(dept)
);

create table exam_slot(
	date varchar(10) not null,
	exam_slot int not null,
	coursecode varchar(10) not null,
	sem int not null,
	dept varchar(10) not null,
	faculty varchar(50) not null,
	type varchar(10) not null,
	academic_year int not null,
	primary key(coursecode,sem,dept,type,academic_year)
);

create table event(
	date varchar(10) not null,
	description varchar(500) not null,
	primary key(date,description)
);

create table holiday(
	date varchar(10) not null,
	reason varchar(500) not null,
	primary key(date)
);

create table holiday_template(
	date varchar(10) not null,
	reason varchar(500) not null,
	primary key(date)
);

create table calendar(
	date varchar(10) not null,
	slot int not null,
	coursecode varchar(10) not null,
	class varchar(5) not null,
	dept varchar(10) not null,
	sem int not null,
	academic_year int not null,
	primary key(date,slot,coursecode,class,dept,sem,academic_year)
);

create table sem_timing(
	sem int not null,
	academic_year int not null,
	start_date varchar(10) not null,
	end_date varchar(10) not null,
	primary key(sem,academic_year)
);

create table faculty_subject(
	faculty varchar(50) not null,
	coursecode varchar(10) not null,
	class varchar(5) not null,
	dept varchar(10) not null,
	sem int not null,
	academic_year int not null,
	primary key(coursecode,faculty,class,dept,sem,academic_year)
);

create table subjects_handled(
	faculty varchar(50) not null,
	coursecode varchar(10) not null,
	primary key(faculty,coursecode)
);

create table course(
	coursecode varchar(50) not null,
	name varchar(100) not null,
	primary key(coursecode)
);

create table dept_class(
	dept varchar(10) not null,
	class varchar(5) not null,
	primary key(dept,class)
);

create table profilechangerequest(
	faculty varchar(50),
	profilephoto varchar(500),
	qualifications varchar(100),
	phone varchar(100),
	name varchar(100),
	email varchar(100),
	primary key(faculty)
);

create table sem_course(
	dept varchar(10) primary key,
	sem int not null,
	coursecode varchar(50) not null,
	foreign key (coursecode) references course(coursecode)
);