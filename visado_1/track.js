class Track {
  constructor(anID, aName, genres, aDuration, anAlbum) {
    this._id = anID;
    this._name = aName;
    this._genres = genres;
    this._duration = aDuration;
    this._album = anAlbum;
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
  set name(aName) {
    return (this._name = aName);
  }
  set genres(genres) {
    return (this._genres = genres);
  }
  set duration(aDuration) {
    return (this._duration = aDuration);
  }
}
module.exports = Track;