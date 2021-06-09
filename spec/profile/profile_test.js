const auth_config = require('../auth/auth_config.json')
const profile_config = require('./profile_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');

let subjects_handled = null;
let admin_token = null;
let faculty_token = null
var Request = require('request')
describe('login as faculty, read profile details, change profile request, login as admin, show profile change requests, accept profile change, ', () => {
    var dataA = {}
    var dataF = {}
    beforeAll((done) => {
        console.log("login as admin");
        let { username, password } = config.admins[0];
        let options = {
            url: `${test_config.baseURL}/auth/login`,
            form: { username, password }
        };
        Request.post(options, (err, res) => {
            dataA.status = res.statusCode;
            dataA.body = res.body;
            admin_token = JSON.parse(res.body).token;
            console.log("profile_test.js 24 admin token",admin_token)
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
        let dataF = {}
        beforeAll((done) => {
            let { username,password,email,role,faculty,phone,name,isactive,profilephoto,qualifications } = auth_config.register;
            options = {
                url: `${test_config.baseURL}/auth/register`,
                form: { username,password,email,role,faculty,phone,name,isactive,profilephoto,qualifications },
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Authorization': `Bearer ${admin_token}`
                }
            };
            Request.post(options, (err, res) => {
                dataF.status = res.statusCode;
                done();
            })
        })
        it('Register faculty', (done) => {
            expect(dataF.status).toBe(200);
            done();
        });
        it('Login as faculty', (done) => {
            let { username, password } = auth_config.register;
            let options = {
                url: `${test_config.baseURL}/auth/login`,
                form: {
                    username, password
                }
            };
            Request.post(options, (err, res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toContain('token');
                faculty_token = JSON.parse(res.body).token;
                console.log("profile_test.js 70 res body",res.body)
            console.log("profile_test.js 71 faculty token",faculty_token)

                done();
            })
        });
    });
    it('Read profile details', (done) => {
        let { username } = profile_config.login;
        let options = {
            url: `${test_config.baseURL}/profile/readuserinfo/${username}`,
            
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${faculty_token}`
            }
        };
        Request.get(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('userinfo');
            done();
        })
    });
    it('Change profile request', (done) => {
        let { username } = profile_config.login;
        console.log('faculty token: ',faculty_token);
        let options = {
            url: `${test_config.baseURL}/profile/requestprofilechange/`,
            form: {
                username
            },
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${faculty_token}`
            }
        };
        Request.post(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            expect(JSON.parse(res.body).message).toEqual("Request sent Successfully!");
            done();
        })
    });
    describe('Login As admin',()=>{
        var dataA = {}
        beforeAll((done) => {
            let { username, password } = config.admins[0];
            let options = {
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
        it('Show Profile Change Requests', (done) => {
            let options = {
                url: `${test_config.baseURL}/profile/showprofilechangerequest`,
                
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Authorization': `Bearer ${admin_token}`
                }
            };
            Request.get(options, (err, res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toContain('requests');
                done();
            })
        });
        it('Accept Profile Change', (done) => {
            let {faculty } = profile_config.deleteprofile
            let options = {
                url: `${test_config.baseURL}/profile/acceptprofilechangerequest`,
                form:{faculty},
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
        });
    })
})
describe('login as faculty, read profile details, change profile request, login as admin, show profile change requests, reject profile change, ', () => {

    
    it('Read profile details', (done) => {
        let { username } = profile_config.login;
        let options = {
            url: `${test_config.baseURL}/profile/readuserinfo/${username}`,
            
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${faculty_token}`
            }
        };
        Request.get(options, (err, res) => {
            console.log("profile_test 208 res body",res.body);
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('userinfo');
            done();
        })
    });
    it('Change profile request', (done) => {
        let { username } = profile_config.login;
        let options = {
            url: `${test_config.baseURL}/profile/requestprofilechange/`,
            form: {
                username
            },
            headers: {
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${faculty_token}`
            }
        };
        Request.post(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            expect(JSON.parse(res.body).message).toEqual("Request sent Successfully!");
            done();
        })
    });
    describe('Login As admin',()=>{
        var dataA = {}
        beforeAll((done) => {
            let { username, password } = config.admins[0];
            let options = {
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
        it('Show Profile Change Requests', (done) => {
            let options = {
                url: `${test_config.baseURL}/profile/showprofilechangerequest`,
                
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Authorization': `Bearer ${admin_token}`
                }
            };
            Request.get(options, (err, res) => {
                expect(res.statusCode).toBe(200)
                done();
            })
        });
        it('Reject Profile Change', (done) => {
            let {faculty } = profile_config.deleteprofile
            let options = {
                url: `${test_config.baseURL}/profile/rejectprofilechangerequest`,
                form:{faculty},
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
        });
    })
})

describe('Login as admin,change user info, get all users, Read user info, login as admin, show profile change requests, reject profile change, ', () => {
    var dataA = {}
        beforeAll((done) => {
            let { username, password } = config.admins[0];
            let options = {
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
        it('Change user info', (done) => {
            let { oldusername, username, profilephoto, qualifications, phone, name, email } = profile_config.changeuserinfo;
            let options = {
                url: `${test_config.baseURL}/profile/changeuserinfo`,
                form:{ oldusername, username, profilephoto, qualifications, phone, name, email },
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
        });
        it('get all users', (done) => {
            let options = {
                url: `${test_config.baseURL}/profile/getallusers`,
                
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Authorization': `Bearer ${admin_token}`
                }
            };
            Request.get(options, (err, res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toContain('users');
                done();
            })
        });
        it('Read user info', (done) => {
            let { username } = profile_config.login;
            let options = {
                url: `${test_config.baseURL}/profile/readuserinfo/${username}`,
                
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Authorization': `Bearer ${admin_token}`
                }
            };
            Request.get(options, (err, res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toContain('userinfo');
                done();
            })
        });
        it('init profile change details', (done) => {
            let { username } = profile_config.login;
            let options = {
                url: `${test_config.baseURL}/profile/initprofilechangedetails`,
                
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Authorization': `Bearer ${admin_token}`
                }
            };
            Request.get(options, (err, res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toContain('result');
                done();
            })
        });

        it('ForceRemove faculty', (done) => {
            let { username } = profile_config.login;
            let options = {
                url: `${test_config.baseURL}/auth/forceremoveuser`,
                form:{ username },
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
});