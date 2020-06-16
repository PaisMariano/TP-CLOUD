var rp = require('request-promise');

class Track {
  constructor(anID, aName, genres, aDuration, anAlbum) {
    this._id = anID;
    this._name = aName;
    this._genres = genres;
    this._duration = aDuration;
    this._album = anAlbum;
    this._lyrics = "";
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
  get lyrics() {
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
  set lyrics(lyrics) {
    return (this._lyrics = lyrics);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      genres: this.genres,
      duration: this.duration,
      lyrics: this.lyrics
    }
  }
}
module.exports = Track;