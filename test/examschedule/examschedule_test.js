require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const examschedule_config = require('./examschedule_config.json');
const test_config = require('../test_config');

describe('get examschedule, download examschedule', () => {
    it('get examschedule', (done) => {
        let { scheduleDetails } = examschedule_config;
        chai.request(test_config.baseURL).post('/examschedule/getexamschedule').send(scheduleDetails).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            done();
        });
    });
    it('download examschedule', (done) => {
      let { downloadScheduleDetails } = examschedule_config;
      chai.request(test_config.baseURL).post('/examschedule/downloadexamschedule').send(downloadScheduleDetails).end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('result');
          done();
      });
    });

    
});