const creds = require('./spotifyCreds.json');
var rp = require('request-promise');

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
        // Esto era si tomaba "artistName" por parametro, en lugar de "artistId"

    // const artistsFound = this._searcher.searchArtists(this._artists, artistName).length;
    // const artist;
    // if (artistsFound.length > 0) {
    //   artist = artistsFound[0];
    // } else {
    //   throw NoMatchingArtistNameException(artistName);
    // }

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

    rp.get(options)
    .then((artistSearchResponse) => JSON.parse(artistSearchResponse).artists.items[0].id)
    .then((artistId) => {
      rp.get({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums',
        qs: {
          q: uriEncodedArtistName,
          type:'artist'
        },
        headers: { Authorization: 'Bearer ' + creds.access_token },
        json: true,
      })
      .then((albumsResponse) => {
        // armar un arreglo de albums que sean {name: "asd", year: 1234}
        const albums = JSON.parse(albumsResponse).items.map(albumRes => {
          return {name: albumRes.name, year: albumRes.release_date.slice(0, 4)}
        });

        albums.forEach(album => unqfy.addAlbum(artistId, album));
      })
    })
  }
}

module.exports = Artist;