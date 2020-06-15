const creds = require('../spotifyCreds.json');
var rp = require('request-promise');
const Printer = require('../printer');
const printer = new Printer();
const CLIENT_ID = 'd38a0113ad3e429c9dbfe4ed483a2874'; // Your client id
const CLIENT_SECRET = 'a9176cac20db4393877e6a0ffb99bff3'; // Your secret

class SpotifyHelper {

    _refreshToken(refreshToken) {
        console.log("Arranco refreshToken");
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

    _searchArtistByName(authToken, artist) {
        const uriEncodedArtistName = encodeURI(artist.name);
        const searchOptions = {
            url: 'https://api.spotify.com/v1/search',
            qs: {
                q: uriEncodedArtistName,
                type: 'artist'
            },
            headers: { Authorization: 'Bearer ' + authToken },
            json: true,
        };

        return rp.get(searchOptions)
    }

    _getArtistsAlbums(authToken, artistSearchResponse) {
        const artistId = artistSearchResponse.artists.items[0].id;
        const options = {
            url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums',
            headers: {
                Authorization: 'Bearer ' + authToken,
                include_groups: 'album'
            },
            json: true
        };
        
        return rp.get(options)
        .then((albumsResponse) => {
            const albums = albumsResponse.items.map(albumRes => {
                return { name: albumRes.name, year: albumRes.release_date.slice(0, 4) }
            });

            const albumsSinRepetidosDeNombre = [];
            albums.forEach(album => {
                if (albumsSinRepetidosDeNombre.every(albm => albm.name.toLowerCase() !== album.name.toLowerCase())) {
                    albumsSinRepetidosDeNombre.push(album);
                }
            });

            return new Promise ((resolve, reject) => 
                resolve(albumsSinRepetidosDeNombre)
            );
        })
    }

    _addAlbumsToUnqfy(unqfy, artist, albumsData) {
        try {
            albumsData.forEach(albumData => unqfy.addAlbum(artist.id, albumData));
            unqfy.save('data.json');
            printer.printEntity('Artista actualizado', artist);
          } catch (exception) {
            printer.printException(exception);
          }
    }

    populateAlbumsForArtist(unqfy, artist) {
        let access_token;
        this._refreshToken(creds.refresh_token)
        .then(refreshTokenResponse => {
            access_token = refreshTokenResponse.access_token;
            return this._searchArtistByName(access_token, artist);
        })
        .then(searchArtistResponse => this._getArtistsAlbums(access_token, searchArtistResponse))
        .then(albums => this._addAlbumsToUnqfy(unqfy, artist, albums));
    }
}

module.exports = SpotifyHelper;