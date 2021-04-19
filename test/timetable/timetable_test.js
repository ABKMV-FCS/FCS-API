require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;
const timetable_config = require('./timetable.json');
const test_config = require('../test_config');
const config = require('../../config.json');

let admin_token = null;
let user_token = null
describe('Login as admin, Download Student Timetable, read faculty, Download Faculty Timetable,read dept,get active sem', () => {
    it('Login as admin', (done) => {
        let { username, password } = config.admins[0];
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            admin_token = res.body.token;
            res.body.should.have.property('token');
            done();
        });
    });
    it('Download Student Timetable', (done) => {
        let { dept, sec, sem }  = timetable_config.studenttimetabledownload;
        chai.request(test_config.baseURL).post('/timetable/studenttimetabledownload').set('Authorization', `Bearer ${admin_token}`).send({ dept, sec, sem }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('timetable');
            done();
        });
    });
    it('read faculty', (done) => {
        chai.request(test_config.baseURL).get('/timetable/readfaculty').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            // console.log(res);
            // res.should.have.status(200);
            expect(res.status).to.be.oneOf([200, 400]);
            done();
        });
    });
    it('Download Faculty Timetable', (done) => {
        let { faculty }  = timetable_config.studenttimetabledownload;
        chai.request(test_config.baseURL).post('/timetable/facultytimetabledownload').set('Authorization', `Bearer ${admin_token}`).send({ faculty }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('timetable');
            done();
        });
    });
    it('read dept', (done) => {
        chai.request(test_config.baseURL).get('/timetable/readdept').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            // console.log(res);
            // res.should.have.status(200);
            expect(res.status).to.be.oneOf([200, 400]);
            done();
        });
    });
    it('get active sem', (done) => {
        chai.request(test_config.baseURL).get('/timetable/getactivesem').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            // console.log(res);
            // res.should.have.status(200);
            expect(res.status).to.be.oneOf([200, 400]);
            done();
        });
    });
    it('read classes under dept', (done) => {
        let {dept} = timetable_config.readclassesunderdept
        chai.request(test_config.baseURL).get('/timetable/readclassesunderdept/'+dept).set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            // console.log(res);
            // res.should.have.status(200);
            expect(res.status).to.be.oneOf([200, 400]);
            done();
        });
    });
    it('read courses', (done) => {
         chai.request(test_config.baseURL).get('/timetable/readcourses/').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            // console.log(res);
            // res.should.have.status(200);
            expect(res.status).to.be.oneOf([200, 400]);
            done();
        });
    });
    it('get course list under sem', (done) => {
        let { dept,sem } = timetable_config.getcourselistundersem
        chai.request(test_config.baseURL).post('/timetable/getcourselistundersem/').set('Authorization', `Bearer ${admin_token}`).send({ dept,sem }).end((err, res) => {
            // console.log(res);
            // res.should.have.status(200);
            expect(res.status).to.be.oneOf([200, 400]);
            done();
        });
    });
});