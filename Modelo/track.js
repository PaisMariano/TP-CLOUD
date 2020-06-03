var rp = require('request-promise');

class Track {
  constructor(anID, aName, genres, aDuration, anAlbum) {
    this._id        = anID;
    this._name      = aName;
    this._genres    = genres;
    this._duration  = aDuration;
    this._album     = anAlbum;
    this._lyrics    = "";
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get genres() {
    return this._genres;
  }
  get duration() {
    return this._duration;
  }
  get album() {
    return this._album;
  }
  get lyrics(){
      return this._lyrics;
  }
  set name(aName) {
    return (this._name = aName);
  }
  set genres(genres) {
    return (this._genres = genres);
  }
  set duration(aDuration) {
    return (this._duration = aDuration);
  }
  set lyrics(lyrics){
    return (this._lyrics = lyrics);
  }
  getLyrics(){
    const BASE_URL = 'http://api.musixmatch.com/ws/1.1/';
    const getTrackId = 'track.search';
    const getTrackLyrics = 'track.lyrics.get';
    let options = {
      uri: BASE_URL + getTrackId,
      qs: {
          apikey: 'cf4c761b3b9884733988f4f0a0bfe2ad',
          q_track: this._name
      },
      json: true // Automatically parses the JSON string in the response
      };
  
      return rp.get(
      options
      ).then((response) => {
      var header = response.message.header;
      var body   = response.message.body;
      if (header.status_code !== 200)
        throw new Error('status code != 200');
      if (body.track_list.length === 0)
        throw new Error('No hay tracks con ese nombre.');
      
      return body.track_list[0].track_id;
      }).then((trackId) => {
        return rp({
          uri: BASE_URL + getTrackLyrics,
          qs: {
            apikey: 'cf4c761b3b9884733988f4f0a0bfe2ad',
            track_id: trackId
          },
          json: true
        })
      }).then((response) => {
        let header  = response.message.header;
        let body    = response.message.body;
        if (header.status_code !== 200)
              throw new Error('status code != 200');
        return body.lyrics.lyrics_body;
      })
  }
}
module.exports = Track;