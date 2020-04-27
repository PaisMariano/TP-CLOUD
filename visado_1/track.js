class Track {
    constructor(anID, aName, genres, aDuration, anAlbum){
        this._id        = anID;
        this._name      = aName;
        this._genres    = genres;
        this._duration  = aDuration;
        this._album     = anAlbum;
      }

      get id(){return this._id};
      get name(){return this._name};
      get genres(){return this._genres};
      get duration(){return this._duration};
      get album(){return this._album};
}
