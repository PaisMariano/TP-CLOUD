class Searcher {
    searchArtist(artistList, artistId) {
        return artistList.find(artist => artist.id === artistId);
    }

    searchAlbum(artistList, albumId) {
        let album;

        artistList.forEach(artist => {
            if (album === undefined) {
                album = artist.albums.find(album => album.id === albumId);
            }
        });

        return album;
    }

    searchTrack(artistList, trackId) {
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

    searchPlaylist(playlists, playlistId) {
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

        artistList.find(artist => artist.name === artistName.toLowerCase()).albums.forEach(album => {
           tracks.concat(album.tracks);
        })

        return tracks;
    }

    searchTracksByGenres(artistList, genres) {
        let tracks = [];

        artistList.forEach(artist => {
            artist.albums.forEach(album => {
                album.tracks.forEach(track => {
                    if (genres.some(genre => track.genres.include(genre))) {
                        tracks.push(track);
                    }
                })
            })
        })

        return [...new Set(tracks)];
    }

    existsArtistNamed(artistList, artistName) {
        return artistList.some(artist => artist.name === artistName.toLowerCase());
    }

    existsAlbumNamed(albumList, albumName) {
        return albumList.some(album => album.name === albumName.toLowerCase());
    }

    existsTrackNamed(trackList, trackName) {
        return trackList.some(track => track.name === trackName.toLowerCase());
    }

    searchAlbumsByArtist(artistList, artistName) {
        //creo q no tiene sentido este metodo..revisar antes de implementar.
    }

    searchTracksByPlaylist(playlists, playlistName) {
        //creo q no tiene sentido este metodo..revisar antes de implementar.
    }

    topThreeListenedTracksByArtist(artistList, userList, artistName) {
        let artistTracks = this.searchTracksByArtist(artistList, artistName);

        //mapeo la lista de tracks del artista con una lista de tuplas que tienen el track y la cantidad de veces q se escucho
        artistTracks = artistTracks.map(track => {
            return [track, this.timesListenedTrack(track, userList)];
        });

        //ordeno la lista de tuplas con segun la cantidad de veces que se escucho el track
        artistTracks = artistTracks.sort((trackTupleA, trackTupleB) => {
            if (trackTupleA[1] > trackTupleB[1]) {
                return 1;
            }
            if (trackTupleA[1] < trackTupleB[1]) {
                return -1;
            }
            return 0;
        });

        //retorno los 3 temas mas escuchados
        return artistTracks.slice(0, 3).map(trackTuple => trackTuple[0]);
    }

    timesListenedTrack(aTrack, userList) {
        return userList.reduce((accum, user) => accum + user.timesListened(aTrack), 0);
    }
}
module.exports = Searcher;