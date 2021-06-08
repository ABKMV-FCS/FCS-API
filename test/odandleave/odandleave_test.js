require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const odandleave_config = require('./odandleave_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');

let admin_token = null;
describe('OD and Leave', () => {

    it('Login as admin', (done) => {
        let { username, password } = odandleave_config.auth;
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            admin_token = res.body.token;
            done();
        });
    });

    it('Get slot details', (done) => {
        chai.request(test_config.baseURL).get('/odandleave/getslotdetails').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            done();
        });
    });
    it('Show OD request', (done) => {
        chai.request(test_config.baseURL).get('/odandleave/showodrequest').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
    it('Show leave request', (done) => {
        chai.request(test_config.baseURL).get('/odandleave/showleaverequest').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });


});