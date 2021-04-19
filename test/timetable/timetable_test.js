require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const auth_config = require('./profile_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');

let admin_token = null;
let user_token = null
describe('login as faculty, read profile details, change profile request, login as admin, show profile change requests, accept profile change, ', () => {

    it('Login as faculty', (done) => {
        let { username, password } = profile_config.register;
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            user_token = res.body.token;
            done();
        });
    });

    it('Read profile details', (done) => {
        let { username } = auth_config.register;
        chai.request(test_config.baseURL).get('/profile/readuserinfo/' + username).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('userinfo');
            res.body.userinfo[0].should.have.property('username').eql(username);
            done();
        });
    });

    it('Change profile request', (done) => {
        let { username } = auth_config.register;
        chai.request(test_config.baseURL).post('/profile/requestprofilechange/' + username).send({ username, password }).set('Authorization', `Bearer ${user_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql("Request sent Successfully!");
            done();
        });
    });
    
    it('Login as admin', (done) => {
        let { username, password } = config.admins[0];
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            admin_token = res.body.token;
            res.body.should.have.property('token');
            done();
        });
    });
});