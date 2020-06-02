const Artist = require('./artist.js');
const Album = require('./album.js');
const Track = require('./track.js');
const User = require('./user.js');
const {AlreadyExistsArtistException, AlreadyExistsAlbumException,
  AlreadyExistsTrackException} = require('./exceptions.js');

class AbmHandler {
  constructor() {
    this._artistId = 0;
    this._albumId = 0;
    this._trackId = 0;
    this._userId = 0;
  }

  get artistId() {
    return this._artistId;
  }
  get albumId() {
    return this._albumId;
  }
  get trackId() {
    return this._trackId;
  }

  createArtist(unqfy, artistData) {
    if (unqfy.searcher.existsArtistNamed(unqfy.artists, artistData.name)) {
      throw new AlreadyExistsArtistException(artistData.name);
    }

    this._artistId = this._artistId + 1;
    const tempArtist = new Artist(
      this._artistId,
      artistData.name,
      artistData.country
    );
    unqfy.artists.push(tempArtist);

    return tempArtist;
  }
  createAlbum(unqfy, artistId, albumData) {
    const tempArtist = unqfy.getArtistById(artistId);
    if (unqfy.searcher.existsAlbumNamed(tempArtist.albums, albumData.name)) {
      throw new AlreadyExistsAlbumException(albumData.name, artistId);
    }

    this._albumId = this._albumId + 1;
    const tempAlbum = new Album(
      this._albumId,
      albumData.name,
      albumData.year,
      tempArtist
    );
    tempArtist.albums.push(tempAlbum);

    return tempAlbum;
  }
  createTrack(unqfy, albumId, trackData) {
    const tempAlbum = unqfy.getAlbumById(albumId);
    if (unqfy.searcher.existsTrackNamed(tempAlbum.tracks, trackData.name)) {
      throw new AlreadyExistsTrackException(trackData.name, albumId);
    }

    this._trackId = this._trackId + 1;
    const tempTrack = new Track(
      this._trackId,
      trackData.name,
      trackData.genres,
      trackData.duration,
      tempAlbum
    );
    tempAlbum.tracks.push(tempTrack);

    return tempTrack;
  }
  createUser(unqfy, userData) {
    this._userId = this._userId + 1;
    const tempUser = new User(this._userId, userData.name);
    unqfy.users.push(tempUser);
    return tempUser;
  }
  updateArtist(unqfy, artistId, artistData) {
    const tempArtist = unqfy.getArtistById(artistId);
    tempArtist.name = artistData.name;
    tempArtist.country = artistData.country;
  }
  updateAlbum(unqfy, albumId, albumData) {
    const tempAlbum = unqfy.getAlbumById(albumId);
    tempAlbum.name = albumData.name;
    tempAlbum.year = albumData.year;
  }
  updateTrack(unqfy, trackId, trackData) {
    const tempTrack = unqfy.getTrackById(trackId);
    tempTrack.name = trackData.name;
    tempTrack.genres = trackData.genres;
    tempTrack.duration = trackData.duration;
  }
  deleteArtist(unqfy, artistId) {
    this.genericDeleteTracks(
      unqfy,
      artistId,
      'users',
      'listenedTracks',
      'album.artist.id'
    );
    this.genericDeleteTracks(
      unqfy,
      artistId,
      'playlists',
      'tracks',
      'album.artist.id'
    );
    unqfy.artists = unqfy.artists.filter((art) => art.id !== artistId);
  }

  deleteAlbum(unqfy, albumId) {
    this.genericDeleteTracks(
      unqfy,
      albumId,
      'users',
      'listenedTracks',
      'album.id'
    );
    this.genericDeleteTracks(unqfy, albumId, 'playlists', 'tracks', 'album.id');
    unqfy.artists = unqfy.artists.map((art) => {
      art.albums = art.albums.filter((album) => album.id !== albumId);
      return art;
    });
  }
  deleteTrack(unqfy, trackId) {
    this.genericDeleteTracks(unqfy, trackId, 'users', 'listenedTracks', 'id');
    this.genericDeleteTracks(unqfy, trackId, 'playlists', 'tracks', 'id');
    unqfy.artists = unqfy.artists.map((art) => {
      art.albums = art.albums.map((album) => {
        album.tracks = album.tracks.filter((track) => track.id !== trackId);
        return album;
      });
      return art;
    });
  }
  //DELETE GENERICO PARA CUALQUIER LISTA DE UN OBJETO QUE TENGA ID SI ME AGREGAN OTRA LISTA A UNQFY SIRVE
  genericDeleteTracks(unqfy, id, firstList, secondList, props) {
    unqfy[firstList] = unqfy[firstList].map((elem) => {
      elem[secondList] = elem[secondList].filter((track) => {
        return this.resolveProp(track, props) !== id;
      });
      return elem;
    });
  }
  //RESUELVE EL STRING PASADO COMO PROPOSICIONES ANIDADAS
  resolveProp(obj, path) {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }
}

module.exports = AbmHandler;
