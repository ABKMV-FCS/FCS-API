const auth_config = require('./auth_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');

var Request = require('request')

let faculty_token = null;
let admin_token = null;
let options;
describe(' login as admin, register faculty, login as faculty,stay signed in,forgot password, forceremove faculty', () => {
    var dataA = {}
    var dataF = {}
    beforeAll((done) => {
        let { username, password } = config.admins[0];
        options = {
            url: `${test_config.baseURL}/auth/login`,
            form: { username, password }
        };
        Request.post(options, (err, res) => {
            dataA.status = res.statusCode;
            dataA.body = res.body;
            admin_token = JSON.parse(res.body).token;
            done();
        });

    })
    it('Login as admin', (done) => {
        expect(dataA.status).toBe(200)
        expect(dataA.body).toContain('token');
        done();
    })
    describe('Register Faculty, Login as Faculty', () => {
        console.log(admin_token);
        beforeAll((done) => {
            let { username,password,email,role,faculty,phone,name,isactive,profilephoto,qualifications } = auth_config.register;
            options = {
                url: `${test_config.baseURL}/auth/register`,
                form:{ username,password,email,role,faculty,phone,name,isactive,profilephoto,qualifications },
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Authorization': `Bearer ${admin_token}`
                }
            };
            Request.post(options, (err, res) => {
                dataF.status = res.statusCode;
                expect(res.statusCode).toBe(200);
                done();
            })
        })
        it('Register faculty', (done) => {
            expect(dataF.status).toBe(200);
            done();
        });
        it('Login as faculty', (done) => {
            let { username, password } = auth_config.register;
            options = {
                url: `${test_config.baseURL}/auth/login`,
                form: {
                    username, password
                },
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Authorization': `Bearer ${admin_token}`
                }
            };
            Request.post(options, (err, res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toContain('token');
                faculty_token = res.body.token;
                done();
            })
        });
    })
    it('Stay signed in', (done) => {
        let { username, password } = auth_config.register;
        options = {
            url: `${test_config.baseURL}/auth/login`,
            form: {
                username, password
            },
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    
    afterAll((done) => {

        let { username,  } = auth_config.register;
        options = {
            url: `${test_config.baseURL}/auth/forceremoveuser`,
            form: {
                username
            },
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.post(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('message');
            done();
        })
    })




});