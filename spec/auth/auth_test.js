const auth_config = require('./auth_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');

var Request = require('request')

let faculty_token = null;
let admin_token = null;
describe(' login as admin, register faculty, login as faculty,stay signed in,forgot password, forceremove faculty', () => {


    var dataA = {}
    var dataF = {}
    beforeAll((done)=>{
        let { username, password } = config.admins[0];
        let options = {
            url: `${test_config.baseURL}/auth/login`,
            form: { username, password }
        };
        Request.post(options,(err,res)=>{
            dataA.status = res.statusCode;
            dataA.body = res.body;
            admin_token = JSON.parse(res.body).token;
            done();
        });
        options = {
            url: `${test_config.baseURL}/auth/register`,
            form:{...auth_config.register}
            ,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options,(err,res)=>{
            dataF.status = res.statusCode;
            dataF.body = res.body;
            done();
        })
    })
    it('Login as admin', (done) => {
        expect(dataA.status).toBe(200)
        expect(dataA.body).toContain('token');
        done();
    })
    it('Register faculty', (done) => {
        let options = {
            url: `${test_config.baseURL}/auth/register`,
            form:{...auth_config.register}
            ,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options,(err,res)=>{
            expect(dataF.status).toBe(200);
            done();
        })
    });
    it('Login as faculty', (done) => {
        let { username, password } = auth_config.register;
        let options = {
            url: `${test_config.baseURL}/auth/login`,
            form:{
                username, password
            },
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options,(err,res)=>{
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('token');
            faculty_token = res.body.token;
            done();
        })
    });
    it('Stay signed in', (done) => {
        let { username, password } = auth_config.register;
        let options = {
            url: `${test_config.baseURL}/auth/login`,
            form:{
                username, password
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
    it('Forgot Password', (done) => {
        let { username, password } = auth_config.register;
        let options = {
            url: `${test_config.baseURL}/auth/forgotpassword`,
            form:{
                username
            },
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options,(err,res)=>{
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('message');
            done();
        })
    });



});