class Playlist {
  constructor(anID, aName, aDuration, tracks) {
    this._id = anID;
    this._name = aName;
    this._duration = aDuration;
    this._tracks = tracks;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get duration() {
    // this._duration = this.tracks.reduce((accum, track) => accum + track.duration, 0);
    return this._duration;
  }
  get tracks() {
    return this._tracks;
  }
  set tracks(aList) {
    return (this._tracks = aList);
  }

  hasTrack(aTrack) {
    return this.tracks.includes(aTrack);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      duration: this.duration,
      tracks: this.tracks.map(map => map.toJSON())
    }
  }
}
module.exports = Playlist;