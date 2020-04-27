
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const AbmHandler = require('./abmHandler.js');
const Searcher   = require('./searcher.js');

class UNQfy {
  constructor(){
    this._artists     = [];
    this._users       = [];
    this._playlists   = [];
    this._abmHandler  = new AbmHandler();
    this._searcher    = new Searcher();
  }

  get artists(){return this._artists};
  get users(){return this._users};
  get playlists(){return this._playlists};
   

  addArtist(artistData) {
    let tempArtist = this._abmHandler.createArtist( artistData.name, 
                                                    artistData.country);
    this._artists.push(tempArtist);
    return tempArtist;
  }

  addAlbum(artistId, albumData) {
    let tempArtist = this.getArtistById(artistId);
    let tempAlbum  = this._abmHandler.createAlbum(albumData.name, 
                                                  albumData.year, 
                                                  tempArtist);
    tempArtist.albums.push(tempAlbum);
    return tempAlbum;
  }

  addTrack(albumId, trackData) {
    let tempAlbum = this.getAlbumById(albumId);
    let tempTrack = this._abmHandler.createTrack( trackData.name, 
                                                  trackData.genres, 
                                                  trackData.duration, 
                                                  tempAlbum);
    tempAlbum.tracks.push(tempTrack);
    return tempTrack;
  }

  removeArtist(artistId){
    let tempArtist = this.getArtistById(artistId);
    this._artists = this._abmHandler.deleteArtist(this._artists, tempArtist);
  }

  removeAlbum(albumId){
    let tempAlbum = this.getAlbumById(albumId);
    this._artists = this._abmHandler.deleteAlbum(this._artists, tempAlbum);
  }

  removeTrack(trackId){
    let tempTrack = this.getTrackById(trackId);
    this._artists = this._abmHandler.deleteTrack(this._artists, tempTrack);
  }

  getArtistById(id) {return this._searcher.searchArtist(this._artists, id);}

  getAlbumById(id) {return this._searcher.searchAlbum(this._artists, id);}

  getTrackById(id) {return this._searcher.searchTrack(this._artists, id);}

  getPlaylistById(id) {return this._searcher.searchPlaylist(this._playlists, id);}

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

