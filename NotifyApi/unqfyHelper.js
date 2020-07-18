const rp    = require('request-promise');

class UnqfyHelper{
    constructor(){
        this._BASE_URL = 'http://localhost:8081/api';
    }
    existArtist(artistId){
        const options = {
            uri: this._BASE_URL + '/artists/' + artistId,
            json: true
        };
        return rp.get(options);
    }
}

module.exports = {
    UnqfyHelper
  };