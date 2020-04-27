class Playlist {
    constructor(anID, aName, aDuration){
        this._id        = anID;
        this._name      = aName;
        this._year      = aYear;
        this._tracks    = [];
      }
      
      get id(){return this._id};
      get name(){return this._name};
      get duration(){return this._duration};
      get tracks(){return this._tracks};
}
module.exports = Playlist;