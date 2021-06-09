const test_config = require('../test_config');
const config = require('../../config.json');

var Request = require('request')

let admin_token = null;
describe(' Course faculties, Class course details, Faculty working hours, Faculty free hours ', () => {
    var data = {}
    beforeAll((done)=>{
        let { username, password } = config.admins[0];
        let options = {
            url: `${test_config.baseURL}/auth/login`,
            form: { username, password }
        };
        Request.post(options,(err,res)=>{
            data.status = res.statusCode;
            data.body = res.body;
            admin_token = JSON.parse(res.body).token;
            done();
        })
    })
    it('Login as admin', (done) => {
        expect(data.status).toBe(200)
        expect(data.body).toContain('token');
        done();
    })
    it('Course faculties', (done) => {
        let options = {
            url: `${test_config.baseURL}/analytics/getcoursefaculties`,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options,(err,res)=>{
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('result')
            done();
        })
    });
    it('Class course details', (done) => {
        let options = {
            url: `${test_config.baseURL}/analytics/getclasscoursedetails`,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options,(err,res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body).toContain('result')
            done();
        })
    });

    it('Faculty working hours', (done) => {
        let options = {
            url: `${test_config.baseURL}/analytics/getfacultyworkinghours`,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options,(err,res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body).toContain('result');
            done();
        })
    });
    it('Faculty free hours', (done) => {
        let options = {
            url: `${test_config.baseURL}/analytics/getfacultyfreehours`,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options,(err,res)=>{
            expect(res.statusCode).toBe(200);
            expect(res.body).toContain('result');
            done()
        })
    });    
});
