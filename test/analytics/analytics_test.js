require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;
const test_config = require('../test_config');
const config = require('../../config.json');

let admin_token = null;
describe(' Course faculties, Class course details, Faculty working hours, Faculty free hours ', () => {

    it('Login as admin', (done) => {
        let { username, password } = config.admins[0];
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            admin_token = res.body.token;
            res.body.should.have.property('token');
            done();
        });
    });

    it('Course facutlies', (done) => {
        //let { username, password } = profile_config.login;
        chai.request(test_config.baseURL).get('/analytics/getcoursefaculties').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            done();
        });
    });

    it('Class course details', (done) => {
        //let { username, password } = profile_config.login;
        chai.request(test_config.baseURL).get('/analytics/getclasscoursedetails').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            done();
        });
    });

    it('Faculty working hours', (done) => {
        //let { username, password } = profile_config.login;
        chai.request(test_config.baseURL).get('/analytics/getfacultyworkinghours').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            done();
        });
    });

    it('Faculty free hours', (done) => {
        //let { username, password } = profile_config.login;
        chai.request(test_config.baseURL).get('/analytics/getfacultyfreehours').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            done();
        });
    });

    
});
