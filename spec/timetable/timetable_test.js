const timetable_config = require('./timetable.json');
const test_config = require('../test_config');
const config = require('../../config.json');
var Request = require('request')
let admin_token = null;
let user_token = null
describe('Login as admin, Download Student Timetable, read faculty, Download Faculty Timetable,read dept,get active sem', () => {
    let dataA = {}
    beforeAll((done) => {
        let { username, password } = config.admins[0];
        let options = {
            url: `${test_config.baseURL}/auth/login`,
            form: { username, password }
        };
        Request.post(options, (err, res) => {
            dataA.status = res.statusCode;
            dataA.body = res.body;
            admin_token = JSON.parse(res.body).token;
            done();
        });

    })
    it('Login as admin', (done) => {
        expect(dataA.status).toBe(200)
        expect(dataA.body).toContain('token');
        done();
    })
    it('Download Student Timetable', (done) => {
        let { dept, sec, sem }  = timetable_config.studenttimetabledownload;
        let options = {
            url: `${test_config.baseURL}/timetable/studenttimetabledownload`,
            form: { dept, sec, sem },
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    it('read faculty', (done) => {
        let options = {
            url: `${test_config.baseURL}/timetable/readfaculty`,
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    it('Download Faculty Timetable', (done) => {
        let { faculty }  = timetable_config.studenttimetabledownload;
        let options = {
            url: `${test_config.baseURL}/timetable/studenttimetabledownload`,
            form: { faculty },
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    it('read dept', (done) => {
        let options = {
            url: `${test_config.baseURL}/timetable/readdept`,
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    it('get active sem', (done) => {
        let options = {
            url: `${test_config.baseURL}/timetable/getactivesem`,
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    it('read classes under dept', (done) => {
        let {dept} = timetable_config.readclassesunderdept
        let options = {
            url: `${test_config.baseURL}/timetable/readclassesunderdept/${dept}`,
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    it('read courses', (done) => {
        let options = {
            url: `${test_config.baseURL}/timetable/readcourses/`,
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    it('get course list under sem', (done) => {
        let { dept,sem } = timetable_config.getcourselistundersem
        let options = {
            url: `${test_config.baseURL}/timetable/getcourselistundersem/`,
            form:{ dept,sem },
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
});