const Printer = require('../utils/printer');
const printer = new Printer();
var rp = require('request-promise');

class MusixmatchHelper {
  constructor() {
    this._apikey = 'cf4c761b3b9884733988f4f0a0bfe2ad';
    this._BASE_URL = 'http://api.musixmatch.com/ws/1.1/';
  }

  _searchTrackByName(trackName) {
    const options = {
      uri: this._BASE_URL + 'track.search',
      qs: {
        apikey: this._apikey,
        q_track: trackName,
        f_has_lyrics: 1
      },
      json: true
    };

    return rp.get(options);
  }

  _handleNoNameMatch(searchTrackResponse) {
    const header = searchTrackResponse.message.header;
    const body = searchTrackResponse.message.body;
    if (header.status_code !== 200)
      throw new Error('status code != 200');
    if (body.track_list.length === 0)
      throw new Error('No hay tracks con ese nombre.');

    return body.track_list[0].track.track_id;
  }

  _getLyricsByTrackId(trackId) {
    const options = {
      uri: this._BASE_URL + 'track.lyrics.get',
      qs: {
        apikey: this._apikey,
        track_id: trackId
      },
      json: true
    };

    return rp.get(options);
  }

  _handleNoLyrics(lyricsByIdResponse) {
    const header = lyricsByIdResponse.message.header;
    const body = lyricsByIdResponse.message.body;
    if (header.status_code !== 200)
      throw new Error('status code != 200');
    return body.lyrics.lyrics_body;
  }

  _printAndReturnLyrics(track) {
    printer.printMessage(`Lyrics del Track ${track.name} con id ${track.id}: \n ${track.lyrics}`);
    return track.lyrics;
  }

  getLyrics(unqfy, track) {
    if (track.lyrics !== "") {
      return new Promise((resolve, reject) =>
        resolve(this._printAndReturnLyrics(track))
      );
    } else {
      return this._searchTrackByName(track.name)
        .then(searchTrackResponse => this._handleNoNameMatch(searchTrackResponse))
        .then(musixMatchTrackId => this._getLyricsByTrackId(musixMatchTrackId))
        .then(lyricsByIdResponse => this._handleNoLyrics(lyricsByIdResponse))
        .then(musixMatchLyrics => {
          track.lyrics = musixMatchLyrics;
          console.log("Se guarda Unqfy desde musixmatchHelper");
          unqfy.save('data.json');
          return this._printAndReturnLyrics(track);
        })
        .catch(exception => printer.printException(exception));
    }
  }

}

module.exports = MusixmatchHelper;