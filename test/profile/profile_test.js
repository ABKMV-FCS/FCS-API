require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const profile_config = require('./profile_config.json');
const test_config = require('../test_config');
const config = require('../../config.json');

let subjects_handled = null;
let admin_token = null;
let user_token = null
describe('login as faculty, read profile details, change profile request, login as admin, show profile change requests, accept profile change, ', () => {

    it('Login as faculty', (done) => {
        let { username, password } = profile_config.login;
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            user_token = res.body.token;
            done();
        });
    });

    it('Read profile details', (done) => {
        let { username } = profile_config.login;
        chai.request(test_config.baseURL).get('/profile/readuserinfo/' + username).set('Authorization', `Bearer ${user_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('userinfo');
            res.body.userinfo[0].should.have.property('username').eql(username);
            done();
        });
    });

    it('Change profile request', (done) => {
        let { username } = profile_config.login;
        chai.request(test_config.baseURL).post('/profile/requestprofilechange/').set('Authorization', `Bearer ${user_token}`).send({ username }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql("Request sent Successfully!");
            done();
        });
    });

    it('Login as admin', (done) => {
        let { username, password } = config.admins[0];
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            admin_token = res.body.token;
            res.body.should.have.property('token');
            done();
        });
    });
    it('Show Profile Change Requests', (done) => {
        chai.request(test_config.baseURL).get('/profile/showprofilechangerequest').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('requests');
            done();
        });
    });
    it('Accept Profile Change', (done) => {
        let { username } = profile_config.login;
        let faculty = username
        chai.request(test_config.baseURL).post('/profile/acceptprofilechangerequest').set('Authorization', `Bearer ${admin_token}`).send({faculty}).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            done();
        });
    });
});

describe('login as faculty, read profile details, change profile request, login as admin, show profile change requests, reject profile change, ', () => {

    it('Login as faculty', (done) => {
        let { username, password } = profile_config.login;
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            user_token = res.body.token;
            done();
        });
    });

    it('Read profile details', (done) => {
        let { username } = profile_config.login;
        chai.request(test_config.baseURL).get('/profile/readuserinfo/' + username).set('Authorization', `Bearer ${user_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('userinfo');
            res.body.userinfo[0].should.have.property('username').eql(username);
            done();
        });
    });

    it('Change profile request', (done) => {
        let { username } = profile_config.login;
        chai.request(test_config.baseURL).post('/profile/requestprofilechange/').set('Authorization', `Bearer ${user_token}`).send({ username }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql("Request sent Successfully!");
            done();
        });
    });

    it('Login as admin', (done) => {
        let { username, password } = config.admins[0];
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            admin_token = res.body.token;
            res.body.should.have.property('token');
            done();
        });
    });
    it('Show Profile Change Requests', (done) => {
        chai.request(test_config.baseURL).get('/profile/showprofilechangerequest').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('requests');
            done();
        });
    });
    it('Reject Profile Change', (done) => {
        let { username } = profile_config.login;
        let faculty = username
        chai.request(test_config.baseURL).post('/profile/rejectprofilechangerequest').set('Authorization', `Bearer ${admin_token}`).send({faculty}).end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            done();
        });
    });
});
describe('Login as admin,change user info, get all users, Read user info, login as admin, show profile change requests, reject profile change, ', () => {

    it('Login as admin', (done) => {
        let { username, password } = config.admins[0];
        chai.request(test_config.baseURL).post('/auth/login').send({ username, password }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            admin_token = res.body.token;
            res.body.should.have.property('token');
            done();
        });
    });
    // it('read subjects handled info', (done) => {
    //     let { username } = profile_config.login;
    //     chai.request(test_config.baseURL).get('/profile/readsubjectshandledinfo/user').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
    //         console.log(res.body);
    //         res.should.have.status(200);
    //         res.body.should.be.a('object');
    //         res.body.should.have.property('subjects_handledinfo');
    //         subjects_handled = []
    //         if(res.body.subjects_handledinfo.length !=0){
    //             for (let index = 0; index < res.body.subjects_handledinfo.length; index++) {
    //                 subjects_handled.push(res.body.subjects_handledinfo[index].coursecode)
    //             }
    //         }
    //         console.log(subjects_handled);
    //         done();
    //     });
    // });
    it('Change user info', (done) => {
        let { oldusername, username, profilephoto, qualifications, phone, name, email } = profile_config.changeuserinfo;
        chai.request(test_config.baseURL).post('/profile/changeuserinfo').set('Authorization', `Bearer ${admin_token}`).send({ oldusername, username, profilephoto, qualifications, phone, name, email }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            done();
        });
    });

    it('get all users', (done) => {
        chai.request(test_config.baseURL).get('/profile/getallusers').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('users');
            done();
        });
    });

    it('Read user info', (done) => {
        let { username } = profile_config.login;
        chai.request(test_config.baseURL).get(`/profile/readuserinfo/`+username).set('Authorization', `Bearer ${user_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('userinfo')
            done();
        });
    });

    it('init profile change details', (done) => {
        chai.request(test_config.baseURL).get('/profile/initprofilechangedetails').set('Authorization', `Bearer ${admin_token}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('result');
            done();
        });
    });
    // it('change subjects handled info', (done) => {
    //     let {faculty} = profile_config.changesubjectshandledinfo
    //     let coursecodes = subjects_handled
    //     chai.request(test_config.baseURL).post('/profile/changesubjectshandledinfo').set('Authorization', `Bearer ${admin_token}`).send({faculty:'user',coursecodes}).end((err, res) => {
    //         console.log(err);
    //         res.should.have.status(200);
    //         res.body.should.be.a('object');
    //         res.body.should.have.property('message');
    //         done();
    //     });
    // });
    it('ForceRemove faculty', (done) => {
        let { username } = profile_config.login;
        chai.request(test_config.baseURL).post('/auth/forceremoveuser').set('Authorization', `Bearer ${admin_token}`).send({ username }).end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});