const axios = require('axios');
const slackHooks = require('./slackWebhook.json');

class SlackHelper {
    constructor() {
        this._hookUrl = slackHooks.webhookPropio;
    }

    get hookUrl() { return this._hookUrl; }
    set hookUrl(newHookUrl) { return this._hookUrl = newHookUrl; }

    postMessage(message) {
        axios.post(this.hookUrl,{
            text: message
        })
        .then(res => {
            console.log("Respuesta de slack: ", res.data);
        })
        .catch(err => {
            console.error("Fallo el post a slack: ", err);
        });
    }
};

module.exports = SlackHelper;