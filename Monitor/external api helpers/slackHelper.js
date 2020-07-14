const axios = require('axios');

class SlackHelper {
    constructor() {
        this._hookUrl = "https://hooks.slack.com/services/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"
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