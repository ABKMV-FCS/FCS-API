require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const calendar_config = require('./calendar_config.json');
const auth_config = require('../auth/auth_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');
// let ttObj = {
//     stepNumber: 1,
//     deleteConfirmation: false,
//     deleteSelect: null,
//     updateSelect: null,
//     updateConfirmation: false,
//     updateSectionConfirmation: false,
//     updateCourseConfirmation: false,
//     deleteCourseConfirmation: false,
//     attachCourseConfirmation: false,
//     deleteSectionConfirmation: false,
//     departments: [],
//     semesters: [],
//     courses: [],
//     sections: [],
//     createDept: false,
//     createCourses: false,
//     createSection: false,
//     loading: false,
//     noofsems: null,
//     deptFilter: null,
//     semFilter: null,
//     secFilter: null,
//     deptPostData: {
//       dept: null,
//       sems: null,
//     },
//     coursePostData: {
//       coursecode: null,
//       name: null,
//     },
//     attachPostData: {
//       dept: null,
//       coursecodes: [],
//       sem: null,
//     },
//     sectionPostData: {},

//     allcourses: [],
//     allcoursesdd: {},
//     allfaculties: [],
//     allfacultycourses: {},
//     coursetofacultydata: [],
//     cfheaders: [
//       {
//         text: "Course Code",
//         sortable: false,
//         value: "coursecode",
//       },
//       { text: "Faculty", sortable: false, value: "faculty" },
//     ],
//     slotdet: [],
//     ttheaders: [],
//     slotdata: [],
//     facdd: {
//       monday: {},
//       tuesday: {},
//       wednesday: {},
//       thursday: {},
//       friday: {},
//     },

//     requiredRule: [(val) => !!val || "Required!"],
//   };
//  function checkSlotArray() {
//     let days = {
//       MON: "monday",
//       TUE: "tuesday",
//       WED: "wednesday",
//       THU: "thursday",
//       FRI: "friday",
//     };
//     let slots = ["buf", "slot1", "slot2", "slot3", "slot4", "slot5", "slot6"];
//     try {
//       for (let day in ttObj.facdd) {
//       for (let keys of Object.keys(ttObj.slotdet)) {
//         ttObj.facdd[day][keys] = ["-"];
//       }
//     }
//     for (let cf of ttObj.coursetofacultydata) {
//       if (cf.coursecode !== "-" && cf.faculty !=='-') {
//         let dates = ttObj.allfacultycourses[cf.coursecode][cf.faculty];
//         for (let date of dates) {
//           let spl = date.split("-");
//           ttObj.facdd[days[spl[0]]][slots[spl[1]]].push(cf.coursecode);
//         }
//       }
//     }
//     for (let sd of ttObj.slotdata) {
//       for (let [key,value] of Object.entries(sd)) {
//         if(key === "day") continue;
//         if(value !== '-') {
//           let facultydata = ttObj.coursetofacultydata.find(obj => obj.coursecode === value);
//           if(facultydata === undefined || facultydata.faculty === '-') sd[key] = '-';
//           if(ttObj.facdd[sd.day][key].indexOf(value) === -1 && facultydata !== undefined && facultydata.faculty !== '-') ttObj.facdd[sd.day][key].push(value);
//         }
//       }
//     }
//     }catch(error) {
//       console.log(error);
//     }
//     ttObj.slotdata = ttObj.slotdata.slice();
//   }
//   function checkFacultyArray() {
//     for (let i = 0; i < ttObj.coursetofacultydata.length - 2; i++) {
//       if (ttObj.coursetofacultydata[i].coursecode === "-")
//         ttObj.coursetofacultydata.splice(i, 1);
//     }
//     ttObj.allcoursesdd = {};
//     for (let i of ttObj.coursetofacultydata) {
//       ttObj.allcoursesdd[`${i.coursecode}-${i.faculty}`] = [...ttObj.allcourses];
//       for (let j of ttObj.coursetofacultydata) {
//         if (j.coursecode !== i.coursecode) {
//           let idx = ttObj.allcoursesdd[`${i.coursecode}-${i.faculty}`].indexOf(
//             j.coursecode
//           );
//           if (j.coursecode !== "-" && idx !== -1) {
//             ttObj.allcoursesdd[`${i.coursecode}-${i.faculty}`].splice(idx, 1);
//           }
//         }
//       }
//     }
//   }
//  function getTimeTableInit(tt) {
//     try {
//       console.log(tt);
//       ttObj.allfacultycourses = tt.faculties;
//       ttObj.coursetofacultydata = tt.faculty_sub;
//       ttObj.coursetofacultydata.push({coursecode: '-', faculty: '-'});
//       ttObj.allcourses = ["-"];
//       ttObj.allfaculties = { "-": ["-"] };
//       for (let [key, value] of Object.entries(ttObj.allfacultycourses)) {
//         ttObj.allcourses.push(key);
//         ttObj.allfaculties[key] = ["-"];
//         for (let faculty of Object.keys(value)) {
//           if (ttObj.allfaculties[key]) ttObj.allfaculties[key].push(faculty);
//           else {
//             ttObj.allfaculties[key] = [];
//             ttObj.allfaculties[key].push(faculty);
//           }
//         }
//       }
//       checkFacultyArray();

//       ttObj.slotdata = tt.slotdata;
//       ttObj.slotdet = {
//         slot1: "08:50-09:40",
//         slot2: "09:50-10:40",
//         slot3: "11:00-11:50",
//         slot4: "12:00-12:50",
//         slot5: "14:00-15:00",
//         slot6: "15:00-16:00",
//       };
//       ttObj.ttheaders = [];
//       ttObj.ttheaders.push({ text: "day", sortable: false, value: "day" });
//       ttObj.slotdata[0].day = "monday";
//       ttObj.slotdata[1].day = "tuesday";
//       ttObj.slotdata[2].day = "wednesday";
//       ttObj.slotdata[3].day = "thursday";
//       ttObj.slotdata[4].day = "friday";
//       let daymapp = {'monday': 'MON','tuesday': 'TUE','wednesday': 'WED','thursday': 'THU','friday': 'FRI'}
//       for (let sd of ttObj.slotdata) {
//         for (let [key,value] of Object.entries(sd)) {
//           if(value !== '-' && key !== 'day') {
//             let facultydata = ttObj.coursetofacultydata.find(obj => obj.coursecode === value);
//             console.log(facultydata, value);
//             if(facultydata === undefined) { sd[key] = '-'; continue;}
//             let pval = `${daymapp[sd.day]}-${key.charAt(4)}`;
//             if(ttObj.allfacultycourses[facultydata.coursecode][facultydata.faculty].indexOf(pval) === -1) ttObj.allfacultycourses[facultydata.coursecode][facultydata.faculty].push(pval);
//           }
//         }
//       }
//       for (let [key, value] of Object.entries(ttObj.slotdet)) {
//         let row = { text: `${key} (${value})`, sortable: false, value: key };
//         ttObj.ttheaders.push(row);
//       }

//       checkSlotArray();
//     } catch (error) {
//       console.log(error);
//     }
//   }
let admin_token = null;
let faculty_token = null
describe('fetch time table, update time table ', () => {
    it('Login as admin', (done) => {
        let { username, password } = config.admins[0];
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            admin_token = res.body.token;
            res.body.should.have.property('token');
            done();
        });
    });
    it('fetch time table', (done) => {
        let {dept,sem,section} = calendar_config.fetch_tt;
        chai.request(test_config.baseURL).post('/calendar/fetchtimetable').set('Authorization', `Bearer ${admin_token}`).send({dept,sem,section}).end((err, res) => {
            console.log(res.body)
            res.should.have.status(200);
            done();
        });
    });

    // it('update time table', (done) => {
    //     chai.request(test_config.baseURL).post('/calendar/updatetimetable').set('Authorization', `Bearer ${admin_token}`).send({slotdata: ttObj.slotdata, coursetofacultydata: ttObj.coursetofacultydata, dept: ttObj.deptFilter, sem: ttObj.semFilter, section: ttObj.secFilter}).end((err, res) => {
    //         console.log(err);
    //         res.should.have.status(200);
    //         res.body.should.be.a('object');
    //         res.body.should.have.property('message').eql("update successful, time table successfully changed");
    //         done();
    //     });
    // });
});