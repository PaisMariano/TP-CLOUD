class Searcher {
    searchArtist(artistList, artistId) { //preguntar, buscamos por nombre o por id?
        return artistList.find(artist => artist.id === artistId);
    }

    searchAlbum(artistList, albumId) { //preguntar, buscamos por nombre o por id?
        let album;

        artistList.forEach(artist => {
            if (album === undefined) {
                album = artist.albums.find(album => album.id === albumId);
            }
        });

        return album;
    }

    searchTrack(artistList, trackId) { //preguntar, buscamos por nombre o por id?
        let track;
        
        artistList.forEach(artist => {
            if (track === undefined) {
                artist.albums.forEach(album => {
                    if (track === undefined) {
                        track = album.tracks.find(track => track.id === trackId);
                    }
                });
            }
        });

        return track;
    }

    searchPlaylist(playlists, playlistId) { //preguntar, buscamos por nombre o por id?
        return playlists.find(playlist => playlist.id === playlistId);
    }

    searchArtists(artistList, partialName) {
        return artistList.filter(artist => artist.name.startsWith(partialName.toLowerCase()));
    }

    searchAlbums(artistList, partialName) {
        let albums = [];

        artistList.forEach(artist => {
            albums.concat(artist.albums.filter(album => album.name.startsWith(partialName.toLowerCase())));
        });

        return albums;
    }

    searchTracks(artistList, partialName) {
        let tracks = [];

        artistList.forEach(artist => {
            artist.albums.forEach(album => {
                tracks.concat(album.tracks.filter(track => track.name.startsWith(partialName.toLowerCase())));
            })
        })

        return tracks;
    }

    searchTracksByArtist(artistList, artistName) {
        let tracks = [];

        artistList.filter(artist => artist.name === artistName).albums.forEach(album => {
           tracks.concat(album.tracks);
        })

        return tracks;
    }

    searchTracksByGenres(artistList, genres) {
        let tracks = [];

        artistList.forEach(artist => {
            artist.albums.forEach(album => {
                album.tracks.forEach(track => {
                    if (track.genres.some(genre => genres.include(genre))) {
                        tracks.push(track);
                    }
                })
            })
        })

        return [...new Set(tracks)];
    }

    searchAlbumsByArtist(artistList, artistName) {

    }

    searchTracksByPlaylist(playlists, playlistName) {

    }

    topThreeListenedTracksByArtist(userList, artistName) {

    }
}
module.exports = Searcher;