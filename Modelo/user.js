class User {
  constructor(anID, aName) {
    this._id = anID;
    this._name = aName;
    this._listenedTracks = [];
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get listenedTracks() {
    return this._listenedTracks;
  }
  set name(aName) {
    this._name = aName;
  }
  set listenedTracks(aList) {
    return (this._listenedTracks = aList);
  }

  listen(aTrack) {
    this._listenedTracks.push(aTrack);
  }

  getListenedTracks() {
    // eslint-disable-next-line no-undef
    return [...new Set(this._listenedTracks)];
  }

  timesListened(aTrack) {
    return this._listenedTracks.reduce(
      (accum, track) => accum + (track === aTrack ? 1 : 0),
      0
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      listenedTracks: this._listenedTracks.map(track => track.toJSON())
    }
  }
}
module.exports = User;