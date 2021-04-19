require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const auth_config = require('./auth_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');

let admin_token = null;
let faculty_token = null;

describe('login as admin, register faculty, login as faculty,stay signed in,forgot password, forceremove faculty', () => {

    it('Login as admin', (done) => {
        let { username, password } = config.admins[0];
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            admin_token = res.body.token;
            res.body.should.have.property('token');
            done();
        });
    });
    
    it('Register faculty', (done) => {
        chai.request(test_config.baseURL).post('/auth/register').set('Authorization', `Bearer ${admin_token}`).send(auth_config.register).end((err, res) => {
            console.log(res.body.message);
            res.should.have.status(200);
            done();
        });
    });
    
    it('Login as faculty', (done) => {
        let { username, password } = auth_config.register;
        chai.request(test_config.baseURL).post('/auth/login').set('Authorization', `Bearer ${admin_token}`).send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            faculty_token = res.body.token;
            done();
        });
    });
    it('Stay signed in', (done) => {
        chai.request(test_config.baseURL).post('/auth/staysignedin').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
    it('Forgot Password', (done) => {
        let { username } = auth_config.register;
        chai.request(test_config.baseURL).post('/auth/forgotpassword').send({ username }).end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);
            res.body.should.have.property('message');
            done();
        });
    });

    
});