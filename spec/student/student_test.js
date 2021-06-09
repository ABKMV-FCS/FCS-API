const test_config = require('../test_config');
var Request = require('request')
describe('Student Routes Check', () => {
    it('subscribe init', (done) => {
        let options = {
            url: `${test_config.baseURL}/student/subscribeinit`,
        };
        Request.get(options, (err, res) => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toContain('academic_year');
            expect(res.body).toContain('odd');
            expect(res.body).toContain('departmentClasses');
            done();
        })
    });
});