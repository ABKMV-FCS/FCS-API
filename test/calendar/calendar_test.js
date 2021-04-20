require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const calendar_config = require('./calendar_config.json');
const auth_config = require('../auth/auth_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');

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

    
});