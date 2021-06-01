const axios = require('axios');
const config = require('../../config.json');
const { query } = require('../db');


let sendnotification = async function (notificationToken,msg) {

    try {
        axios.post('https://fcm.googleapis.com/fcm/send', {
            "data": {
                "click_action": `${config.hostname}`
            },
            "notification": {
                "title": "Faculty Calendar Scheduler",
                "body": msg,
                "click_action": `${config.hostname}`,
                "icon": `${config.hostname}/favicon.ico`
            },
            "to": notificationToken
        }, {
            headers: { Authorization: "Bearer " + config.fcmServerKey }
        });
    } catch (error) {

    }
};
// sendnotification('cBMenRE70MAbSSfEEztWK6:APA91bGMsjzlnOc2554lcSR4_uyV2VZp9GJiq_zpAVSXTus_jz5Hd3y4KQ2HAGtu-uDMCxej02LPznB1fW6sOcnDncpzVMNXLGYwh12qCN_nH8h0P7LHrhYXx-EXsJ6VjAf5vShVygLd','hello from server')
module.exports=sendnotification