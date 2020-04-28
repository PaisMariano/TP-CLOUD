class Playlist {
    constructor(anID, aName, tracks){
        this._id        = anID;
        this._name      = aName;
        this._tracks    = tracks;
      }
      
      get id(){return this._id};
      get name(){return this._name};
      get tracks(){return this._tracks};

      duration() {
        return this.tracks.reduce((accum, track) => (accum + track.duration), 0);
      }

      hasTrack(aTrack) {
        return this.tracks.includes(aTrack);
      }
}
module.exports = Playlist;