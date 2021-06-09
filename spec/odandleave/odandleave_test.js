const test_config = require('../test_config');
const config = require('../../config.json');
let admin_token = null;
var Request = require('request')
describe('OD and Leave', () => {

    var dataA = {}
    var dataF = {}
    beforeAll((done)=>{
        let { username, password } = config.admins[0];
        let options = {
            url: `${test_config.baseURL}/auth/login`,
            form: { username, password },
            
        };
        Request.post(options,(err,res)=>{
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
    it('Get slot details', (done) => {
        let options = {
            url: `${test_config.baseURL}/odandleave/getslotdetails`,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options,(err,res)=>{
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('message')
            done();
        })
    });
    it('Show OD request', (done) => {
        let options = {
            url: `${test_config.baseURL}/odandleave/showodrequest`,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options,(err,res)=>{
            expect(res.statusCode).toBe(200)
            done();
        })
    });
    it('Show leave request', (done) => {
        let options = {
            url: `${test_config.baseURL}/odandleave/showleaverequest`,
            headers:{
                'Accept': 'application/json, text/plain',
                'Authorization': `Bearer ${admin_token}`
            }
        };
        Request.get(options,(err,res)=>{
            expect(res.statusCode).toBe(200)
            done();
        })
    });
})

