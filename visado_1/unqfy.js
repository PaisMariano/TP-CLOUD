
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const AbmHandler = require('./abmHandler.js');
const Searcher   = require('./searcher.js');
const PlaylistGenerator = require('./playlistGenerator.js');
const Artist = require('./artist.js');
const Album = require('./album.js');
const Track = require('./track.js');
const Playlist = require('./playlist.js');
const User = require('./user.js');
const UserHandler = require('./userHandler.js');

class UNQfy {
  constructor(){
    this._artists           = [];
    this._users             = [];
    this._playlists         = [];
    this._abmHandler        = new AbmHandler();
    this._searcher          = new Searcher();
    this._playlistGenerator = new PlaylistGenerator();
    this._userHandler       = new UserHandler();
  }
  //GETTERS AND SETTERS:
  get artists(){return this._artists;}
  get users(){return this._users;}
  get playlists(){return this._playlists;}
  get searcher(){return this._searcher;}

  set artists(artistList){return this._artists = artistList;}
  set users(userList){return this._users = userList;}
  set playlists(playlistList){return this._playlists = playlistList;}

  //ADD METHODS:
  addArtist(artistData){return this._abmHandler.createArtist(this, artistData);}
  addAlbum(artistId, albumData){return this._abmHandler.createAlbum(this, artistId, albumData);}
  addTrack(albumId, trackData){return this._abmHandler.createTrack(this, albumId, trackData);}
  addUser(userData){return this._abmHandler.createUser(this, userData);}
  addPlaylist(playlistData){return this._playlistGenerator.createPlaylist(this, playlistData);}

  //UPDATE METHODS:
  updateArtist(artistId, artistData){this._abmHandler.updateArtist(this, artistId, artistData);}
  updateAlbum(albumId, albumData){this._abmHandler.updateAlbum(this, albumId, albumData);}
  updateTrack(trackId, trackData){this._abmHandler.updateTrack(this, trackId, trackData);}
  
  //REMOVE METHODS:
  removeArtist(artistId){this._abmHandler.deleteArtist(this, artistId);}
  removeAlbum(albumId){this._abmHandler.deleteAlbum(this, albumId);}
  removeTrack(trackId){this._abmHandler.deleteTrack(this, trackId);}
  removePlaylist(playlistId){this._playlistGenerator.removePlaylist(this, playlistId);}

  //GET METHODS:
  searchByName(aString){return this._searcher.searchByName(this, aString);}
  getArtistById(id){return this._searcher.searchArtist(this._artists, id);}
  getAlbumById(id){return this._searcher.searchAlbum(this._artists, id);}
  getTrackById(id){return this._searcher.searchTrack(this._artists, id);}
  getUserById(id){return this._searcher.searchUser(this._users, id);} 
  getPlaylistById(id){return this._searcher.searchPlaylist(this._playlists, id);}
  getTracksMatchingGenres(genres){return this._searcher.searchTracksByGenres(this._artists, genres);}
  getTracksMatchingArtist(anArtist){return this._searcher.searchTracksByArtist(this._artists, anArtist.id);}
  getPartialMatchingTracks(partialName){return this._searcher.searchTracks(this._artists, partialName);}
  getPartialMatchingAlbums(partialName){return this._searcher.searchAlbums(this._artists, partialName);}
  getPartialMatchingArtists(partialName){return this._searcher.searchArtists(this._artists, partialName);}
  getPartialMatchingPlaylists(partialName){return this._searcher.searchPlaylists(this._playlists, partialName);}
  artistTopThreeTracks(artistId){return this._searcher.topThreeListenedTracksByArtist(this._artists, this._users, artistId);}
  timesListened(userId, trackId) {return this._searcher.timesListenedByUser(this, userId, trackId);}
  listen(userId, trackId){return this._userHandler.listen(this, userId, trackId);}

  //USER METHODS
  listenedTracks(userId) {return this._userHandler.listenedTracks(this, userId);}

  //PLAYLIST METHODS:
  createPlaylist(name, genresToInclude, maxDuration){ 
    return this._playlistGenerator.generate(
      name,
      maxDuration, 
      genresToInclude, 
      this);
  }
  
  //GIVEN METHODS:
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
    const classes = [UNQfy, Artist, Album, Track, Playlist, User, PlaylistGenerator, AbmHandler, Searcher, UserHandler];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

module.exports = {
  UNQfy,
};

