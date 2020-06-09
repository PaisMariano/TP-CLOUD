const creds = require('./spotifyCreds.json');
var rp = require('request-promise');
const Printer = require('./printer');
const printer = new Printer();
const main = require('./main');
// const {CLIENT_ID, CLIENT_SECRET} = require('./generateSpotifyCredentials');
const CLIENT_ID = 'd38a0113ad3e429c9dbfe4ed483a2874'; // Your client id
const CLIENT_SECRET = 'a9176cac20db4393877e6a0ffb99bff3'; // Your secret

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
  noArtistIncludedAlbums(){
    return this.albums.map(album => {
      return { id: album.id, name: album.name, year: album.year }
    });
  }
  populateAlbumsForArtist(unqfy) {
    const selfArtist = this;

    const uriEncodedArtistName = encodeURI(this.name);
    const options = {
      url: 'https://api.spotify.com/v1/search',
      qs: {
        q: uriEncodedArtistName,
        type:'artist'
      },
      headers: { Authorization: 'Bearer ' + creds.access_token },
      json: true,
    };

    const refreshOptions = {
      uri: 'https://accounts.spotify.com/api/token',
      headers: { Authorization: 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: creds.refresh_token
      },
      json: true
    };
   
    rp.post(refreshOptions)
    .then(function (parsedBody) {
      options.headers = { Authorization: 'Bearer ' + parsedBody.access_token };
      rp.get(options)
      .then((artistSearchResponse) => artistSearchResponse.artists.items[0].id)
      .then((artistId) => {
        options.url = 'https://api.spotify.com/v1/artists/' + artistId + '/albums'
        rp.get(options)
        .then((albumsResponse) => {
          // armar un arreglo de albums que sean {name: "asd", year: 1234}
          const albums = albumsResponse.items.map(albumRes => {
            return {name: albumRes.name, year: albumRes.release_date.slice(0, 4)}
          });
  
          try {
            albums.forEach(album => unqfy.addAlbum(selfArtist.id, album));
            main.saveUNQfy(unqfy);
            printer.printEntity('Artista actualizado', selfArtist);
          } catch (exception) {
            printer.printException(exception);
          }
        })
      })
    })
    .catch(function (err) {
      printer.printException(exception);
    })
  }
}

module.exports = Artist;