require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const test_config = require('../test_config');



describe('Student Routes Check', () => {

    it('subscribe init', (done) => {
        chai.request(test_config.baseURL).get('/student/subscribeinit').end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('academic_year');
            res.body.should.have.property('odd');
            res.body.should.have.property('departmentClasses');
            done();
        });
    });
});