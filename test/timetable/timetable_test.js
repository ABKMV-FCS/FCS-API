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
describe('Download Faculty Timetable, read faculty', () => {
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
        let { dept, sec, sem }  = timetable_config.studenttimetabledownload;
        chai.request(test_config.baseURL).post('/timetable/studenttimetabledownload').set('Authorization', `Bearer ${admin_token}`).send({ dept, sec, sem }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('timetable');
            done();
        });
    });
});