let rp = require('request-promise');

class NotifyHelper {
  constructor() {
    this._BASE_URL = 'http://localhost:8082/api';
  }

  notifySubscribers(artistId, subject, message) {
    const options = {
      uri: this._BASE_URL + '/notify',
      body: {
        artistId: artistId,
        subject: subject,
        message: message
      },
      json: true
    };
    rp.post(options);
  }
  deleteSubscribers(artistId){
    const options = {
        uri: this._BASE_URL + '/subscriptions',
        body: {
          artistId: artistId
        },
        json: true
      };
  
      return rp.delete(options);
    }

}

module.exports = {
  NotifyHelper
};