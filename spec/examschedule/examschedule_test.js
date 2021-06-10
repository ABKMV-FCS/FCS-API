const examschedule_config = require('./examschedule_config.json');
const test_config = require('../test_config');
var Request = require('request')

describe('get examschedule, download examschedule', () => {
    let { scheduleDetails } = examschedule_config;
    it('get examschedule', (done) => {
        let options = {
            url: `${test_config.baseURL}/examschedule/getexamschedule`,
            form:scheduleDetails,
        };
        Request.post(options,(err,res)=>{
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('message')
            done();
        })
    });
    it('download examschedule', (done) => {
        let { downloadScheduleDetails } = examschedule_config;
        let options = {
            url: `${test_config.baseURL}/examschedule/downloadexamschedule`,
            form:downloadScheduleDetails,
        };
        Request.post(options,(err,res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body).toContain('message');
            done();
        })
    });
    
});