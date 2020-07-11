class Artist {
  constructor(anID, aName, aCountry) {
    this._id = anID;
    this._name = aName;
    this._country = aCountry;
    this._albums = [];
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get country() {
    return this._country;
  }
  get albums() {
    return this._albums;
  }
  set name(aName) {
    return (this._name = aName);
  }
  set country(aCountry) {
    return (this._country = aCountry);
  }
  set albums(aList) {
    return (this._albums = aList);
  }  

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      country: this.country,
      albums: this.albums.map(album => album.toJSON())
    }
  }
}

module.exports = Artist;