class Album {
  constructor(anID, aName, aYear, anArtist) {
    this._id = anID;
    this._name = aName;
    this._year = aYear;
    this._tracks = [];
    this._artist = anArtist;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get year() {
    return this._year;
  }
  get tracks() {
    return this._tracks;
  }
  get artist() {
    return this._artist;
  }
  set name(aName) {
    return (this._name = aName);
  }
  set year(anYear) {
    return (this._year = anYear);
  }
  set tracks(aList) {
    return (this._tracks = aList);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      tracks: this.tracks.map(track => track.toJSON())
    }
  }
}
module.exports = Album;