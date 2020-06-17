const creds = require('./spotifyCreds.json');
var rp = require('request-promise');
const Printer = require('../utils/printer');
const printer = new Printer();
const CLIENT_ID = 'd38a0113ad3e429c9dbfe4ed483a2874'; // Your client id
const CLIENT_SECRET = 'a9176cac20db4393877e6a0ffb99bff3'; // Your secret
const { NoMatchingArtistNameException } = require('../exceptions');

class SpotifyHelper {
  constructor() {
    this._authToken = creds.access_token;
  }

  _refreshToken(refreshToken) {
    const refreshOptions = {
      uri: 'https://accounts.spotify.com/api/token',
      headers: { Authorization: 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      json: true
    };

    return rp.post(refreshOptions);
  }

  _searchArtistByName(artistName) {
    const searchOptions = {
      url: 'https://api.spotify.com/v1/search',
      qs: {
        q: artistName,
        type: 'artist'
      },
      headers: { Authorization: 'Bearer ' + this._authToken },
      json: true,
    };

    return rp.get(searchOptions);
  }

  _handleNoNameMatch(artistSearchResponse, artistName) {
    if (artistSearchResponse.artists.total === 0) {
      throw new NoMatchingArtistNameException(artistName);
    }

    return artistSearchResponse.artists.items[0].id;
  }

  _getArtistsAlbums(artistId) {
    const options = {
      url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums',
      headers: {
        Authorization: 'Bearer ' + this._authToken,
        include_groups: 'album'
      },
      json: true
    };

    return rp.get(options);
  }

  _handleNoAlbumsMatch(albumsByArtistIdResponse, artistId) {
    if (albumsByArtistIdResponse.total === 0) {
      throw Error(`No se encontraron albumes para el artista de id ${artistId}`);
    }

    return albumsByArtistIdResponse.items;
  }

  _mapAlbumsData(spotifyAlbums) {
    const albumsData = spotifyAlbums.map(albumRes => {
      return { name: albumRes.name, year: albumRes.release_date.slice(0, 4) }
    });

    const albumsSinRepetidosDeNombre = [];
    albumsData.forEach(album => {
      if (albumsSinRepetidosDeNombre.every(albm => albm.name.toLowerCase() !== album.name.toLowerCase())) {
        albumsSinRepetidosDeNombre.push(album);
      }
    });

    return albumsSinRepetidosDeNombre;
  }

  _addAlbumsToUnqfy(unqfy, artist, albumsData) {
    try {
      albumsData.forEach(albumData => unqfy.addAlbum(artist.id, albumData));
      console.log("Se guarda Unqfy desde spotifyHelper");
      unqfy.save('data.json');
      printer.printEntity('Artista actualizado', artist);
    } catch (exception) {
      printer.printException(exception);
    }
  }

  populateAlbumsForArtist(unqfy, artist) {
    this._refreshToken(creds.refresh_token)
      .then(refreshTokenResponse => {
        this._authToken = refreshTokenResponse.access_token;
        return this._searchArtistByName(artist.name);
      })
      .then(searchArtistResponse => this._handleNoNameMatch(searchArtistResponse, artist.name))
      .then(spotifyArtistId => this._getArtistsAlbums(spotifyArtistId))
      .then(albumsByIdResponse => this._handleNoAlbumsMatch(albumsByIdResponse, artist.id))
      .then(albumsFromSpotify => this._mapAlbumsData(albumsFromSpotify))
      .then(albums => this._addAlbumsToUnqfy(unqfy, artist, albums))
      .catch(exception => printer.printException(exception));
  }
}

module.exports = SpotifyHelper;