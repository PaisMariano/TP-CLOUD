let rp = require('request-promise');

class LoggingHelper {
  constructor() {
    this._BASE_URL = 'http://localhost:8083/api';
  }

  logEventPost(message, level) {
    const options = {
      uri: this._BASE_URL + '/logging',
      body: {
        message: message,
        level: level
      },
      json: true
    };
    rp.post(options);
  }
}

module.exports = {
  LoggingHelper
};