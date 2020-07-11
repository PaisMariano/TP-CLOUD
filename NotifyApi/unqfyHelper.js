const BASE_URL      = 'http://localhost:8081/api';
const rp            = require('request-promise');
const { ArtistNotFoundException } = require('./exception.js');

class UnqfyHelper{
    constructor(){}
    existArtist(artistId){
        const options = {
            uri: BASE_URL + '/artists/' + artistId,
            json: true
        };
        return rp.get(options);
    }
}

module.exports = {
    UnqfyHelper
  };