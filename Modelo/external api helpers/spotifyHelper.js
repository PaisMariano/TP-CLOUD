const creds = require('../spotifyCreds.json');
var rp = require('request-promise');
const Printer = require('../printer');
const printer = new Printer();
const CLIENT_ID = 'd38a0113ad3e429c9dbfe4ed483a2874'; // Your client id
const CLIENT_SECRET = 'a9176cac20db4393877e6a0ffb99bff3'; // Your secret

class SpotifyHelper {
    constructor(unqfy, artist) {
        this.unqfy = unqfy;
        this._artist = artist;
    }


    refreshToken(refreshToken) {
        const refreshOptions = {
            uri: 'https://accounts.spotify.com/api/token',
            headers: { Authorization: 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            json: true
        };

        rp.post(refreshOptions)
        .then(function (parsedBody) {
            return parsedBody.access_token;
        })

    }

    searchArtistByName(authToken) {
        const uriEncodedArtistName = encodeURI(this._artist.name);
        const searchOptions = {
            url: 'https://api.spotify.com/v1/search',
            qs: {
                q: uriEncodedArtistName,
                type: 'artist'
            },
            headers: { Authorization: 'Bearer ' + authToken },
            json: true,
        };

        rp.get(searchOptions)
        .then((artistSearchResponse) => ({
            artistId: artistSearchResponse.artists.items[0].id,
            searchOptions
        }))
    }

    getArtistsAlbums({artistId, searchOptions}) {
        options = {
            ...searchOptions,
            url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums'
        }
        rp.get(options)
        .then((albumsResponse) => {
            let albums = albumsResponse.items.map(albumRes => {
                return { name: albumRes.name, year: albumRes.release_date.slice(0, 4) }
            });

            albumsSinRepetidosDeNombre = [];
            albums.forEach(album => {
                if (albumsSinRepetidosDeNombre.every(albm => albm.name !== album.name)) {
                    albumsSinRepetidosDeNombre.push(album);
                }
            });
            return {albumsSinRepetidosDeNombre, unqfy};
        })
    }

    populateAlbumsForArtist() {
        this.refreshToken(creds.refresh_token)
        .then(this.searchArtistByName)
        .then(this.getArtistsAlbums)
        .then(this._artist.addAlbums)
        .catch(function (exception) {
            printer.printException(exception);
        })
    }
}

module.exports = SpotifyHelper;