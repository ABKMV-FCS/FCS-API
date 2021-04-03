-- time table
-- student time table
SELECT
	slot,
	day,
	coursecode
from
	Timetable
WHERE
	class = $ { req.body.class },
	sem = $ { req.body.sem },
	dept = $ { req.body.dept },
	academic_year = $ { req.body.academic_year }

-- faculty time table
select
	day,
	slot,
	coursecode,
	class,
	dept,
	sem
from
	(
		faculty_subject fs
		inner join timetable tt on fs.coursecode = tt.coursecode
		and fs.class = tt.class
		and fs.sem = tt.sem
		and fs.academic_year = tt.academic_year
	) rs
where
	rs.academic_year = $ { req.body.academic_year }
	and rs.faculty = $ { req.body.faculty }
	and MOD(rs.sem, 2) == $ { req.body.odd == = 'odd' ?1 :0 };
-- depts
select dept from dep_duration;
insert into dep_duration values ('$req.body.dept','$req.body.sems');
update dept_duration set sems='${req.body.sems}' where dept like '$req.body.dept';
delete from dept_duration where dept like '$req.body.dept';

-- class
select class from dept_class where dept like '$req.body.dept';
insert into dept_class values ('$req.body.dept','$req.body.class');
delete from dept_class where dept like '$req.body.dept' and class like '$req.body.class';

-- subjects under sem,dept
insert into course values ('$req.body.coursecode','$req.body.name');
update course set name='$req.body.name' where coursecode like '$req.body.coursecode';
delete from course where coursecode like '$req.body.coursecode';


insert into sem_courses values('$req.body.dept','$req.body.sem','$req.body.coursecode');
delete from sem_course where dept like '$req.body.dept' and sem like '$req.body.sem' and coursecode like '$req.body.coursecode';

-- populating calendar

-- check for faculty handling
select count(*) from subjects_handled where faculty like '$req.body.faculty' and coursecode like '$req.body.coursecode';
insert into faculty_subject values('$req.body.coursecode','$req.body.faculty','class','dept','sem','ay') 