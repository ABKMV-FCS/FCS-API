const calendar_config = require('./calendar_config.json');
const auth_config = require('../auth/auth_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');
var Request = require('request')
let admin_token = null;
let faculty_token = null
describe('fetch time table, update time table ', () => {
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
    it('fetch time table', (done) => {
        let {dept,sem,section} = calendar_config.fetch_tt;
        let options = {
            url: `${test_config.baseURL}/calendar/fetchtimetable`,
            form:{
                dept,sem,section
            },
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options,(err,res)=>{
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    

    
});