class Album {
    constructor(anID, aName, aYear, anArtist){
        this._id        = anID;
        this._name      = aName;
        this._year      = aYear;
        this._tracks    = [];
        this._artist    = anArtist;
      }
      
      get id(){return this._id};
      get name(){return this._name};
      get year(){return this._year};
      get tracks(){return this._tracks};
      set tracks(aList){return this._tracks = aList};
      get artist(){return this._artist};
}
module.exports = Album;