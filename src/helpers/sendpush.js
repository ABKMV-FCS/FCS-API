const axios = require('axios');
const config = require('../../config.json');
const { query } = require('../db');


let sendnotification = async function (notificationToken,msg) {

    try {
        axios.post('https://fcm.googleapis.com/fcm/send', {
            "data": {
                "click_action": `http://${config.hostname}`
            },
            "notification": {
                "title": "Faculty Calendar Scheduler",
                "body": msg,
                "click_action": `http://${config.hostname}`,
                "icon": `${config.hostname}/favicon.ico`
            },
            "to": notificationToken
        }, {
            headers: { Authorization: "Bearer " + config.fcmServerKey }
        });
    } catch (error) {

    }
};
sendnotification('df9VBJapB9Fwlnq5OU6as0:APA91bFr93kknjOLvv7NPEqwt8tr9PXx0TjvoPhDDrYbD6zZ3oJ4dYfzEQmGNCkZKvA5uCsrNpkfrety10H3C8mU-2j4a8YJDi24Au_Pkr-MmJeydOUlSrB4roeIbFAmcEAnWWSx2bkL','hello from server')
module.exports=sendnotification