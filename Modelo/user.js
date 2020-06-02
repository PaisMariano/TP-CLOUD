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
  set listenedTracks(aList) {
    return (this._listenedTracks = aList);
  }

  listen(aTrack) {
    this._listenedTracks.push(aTrack);
    // console.log(this._name, 'está escuchando', aTrack.name);
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
}
module.exports = User;