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

drop table sem_course;

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
	section varchar(5) not null,
	dept varchar(10) not null,
	sem int not null,
	academic_year int not null,
	primary key(slot, day, section, dept, sem, academic_year)
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
	primary key(coursecode, sem, dept, type, academic_year)
);

create table event(
	date varchar(10) not null,
	description varchar(500) not null,
	primary key(date, description)
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
	section varchar(5) not null,
	dept varchar(10) not null,
	sem int not null,
	academic_year int not null,
	primary key(
		date,
		slot,
		coursecode,
		section,
		dept,
		sem,
		academic_year
	)
);

create table sem_timing(
	sem int not null,
	academic_year int not null,
	start_date varchar(10) not null,
	end_date varchar(10) not null,
	primary key(sem, academic_year)
);

create table faculty_subject(
	faculty varchar(50) not null,
	coursecode varchar(10) not null,
	section varchar(5) not null,
	dept varchar(10) not null,
	sem int not null,
	academic_year int not null,
	primary key(
		coursecode,
		section,
		dept,
		sem,
		academic_year
	)
);

create table subjects_handled(
	faculty varchar(50) not null,
	coursecode varchar(10) not null,
	primary key(faculty, coursecode)
);

create table course(
	coursecode varchar(50) not null,
	name varchar(100) not null,
	primary key(coursecode)
);

create table dept_class(
	dept varchar(10) not null,
	section varchar(5) not null,
	primary key(dept, section)
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
	dept varchar(10),
	sem int not null,
	coursecode varchar(50) not null,
	primary key(dept,sem,coursecode),
	foreign key (coursecode) references course(coursecode)
);

insert into course values('15CSE301','Database Management Systems');
insert into course values('15CSE302','Theory of Computation');
insert into course values('15CSE303','Computer Organisation and Architecture');
insert into course values('14cse237','Embedded Systems');
insert into course values('14cse235','Cloud Computing');
insert into course values('14cse238','Operating Systems');
insert into course values('14cse239','Compiler Design');

insert into sem_course values('CSE','4','15CSE301');
insert into sem_course values('CSE','4','15CSE302');
insert into sem_course values('CSE','4','14cse235');
insert into sem_course values('CSE','4','14cse237');
insert into sem_course values('CSE','4','14cse238');
insert into sem_course values('CSE','4','14cse239');

insert into dep_duration values('CSE','8');
insert into dep_duration values('ECE','8');
insert into dep_duration values('EEE','8');
insert into dep_duration values('MAT','6');

insert into dept_class values('CSE','A');
insert into dept_class values('CSE','B');
insert into dept_class values('CSE','C');
insert into dept_class values('MAT','A');
insert into dept_class values('MAT','B');
insert into dept_class values('MAT','C');
insert into dept_class values('EEE','A');
insert into dept_class values('EEE','B');

insert into timetable values('1','THU','14cse235','c','cse','4','2018');
insert into timetable values('2','THU','14cse237','c','cse','4','2018');
insert into timetable values('3','THU','14cse238','c','cse','4','2018');
insert into timetable values('4','THU','14cse239','c','cse','4','2018');

	
insert into faculty_subject values('admin1','15CSE301','C','CSE','4','2018');
insert into faculty_subject values('admin1','15CSE302','C','CSE','4','2018');
insert into faculty_subject values('admin1','14cse235','C','CSE','4','2018');
insert into faculty_subject values('admin1','14cse237','C','CSE','4','2018');
insert into faculty_subject values('admin1','14cse238','C','CSE','4','2018');
insert into faculty_subject values('admin1','14cse239','C','CSE','4','2018');

insert into active_sem values('0','2018');

insert into exam_slot values('2021-04-05','1','15CSE301','4','CSE','admin','p1','2018');
insert into exam_slot values('2021-04-04','2','15CSE302','4','CSE','admin','p1','2018');
insert into exam_slot values('2021-04-03','3','15CSE303','4','CSE','admin','p1','2018');