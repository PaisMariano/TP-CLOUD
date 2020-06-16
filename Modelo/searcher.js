const { NoMatchingArtistException, NoMatchingAlbumException,
  NoMatchingTrackException, NoMatchingPlaylistException,
  NoMatchingUserException } = require('./exceptions');

class Searcher {
  searchArtist(artistList, artistId) {
    const artist = artistList.find((artist) => artist.id === artistId);
    if (artist === undefined) {
      throw new NoMatchingArtistException(artistId);
    }
    return artist;
  }

  searchAlbum(artistList, albumId) {
    let album;

    artistList.forEach((artist) => {
      if (album === undefined) {
        album = artist.albums.find((album) => album.id === albumId);
      }
    });
    if (album === undefined) {
      throw new NoMatchingAlbumException(albumId);
    }
    return album;
  }

  searchTrack(artistList, trackId) {
    let track;

    artistList.forEach((artist) => {
      if (track === undefined) {
        artist.albums.forEach((album) => {
          if (track === undefined) {
            track = album.tracks.find((track) => track.id === trackId);
          }
        });
      }
    });
    if (track === undefined) {
      throw new NoMatchingTrackException(trackId);
    }
    return track;
  }

  searchPlaylist(playlists, playlistId) {
    const playlist = playlists.find((playlist) => playlist.id === playlistId);
    if (playlist === undefined) {
      throw new NoMatchingPlaylistException(playlistId);
    }
    return playlist;
  }

  searchUser(usersList, userId) {

    const user = usersList.find((user) => user.id === userId);
    if (user === undefined) {
      throw new NoMatchingUserException(userId);
    }
    return user;
  }

  searchArtists(artistList, partialName) {
    return artistList.filter((artist) => artist.name.toLowerCase().includes(partialName.toLowerCase()));
  }

  searchAlbums(artistList, partialName) {
    let albums = [];

    artistList.forEach((artist) => {
      albums = albums.concat(
        artist.albums.filter((album) => album.name.toLowerCase().includes(partialName.toLowerCase()))
      );
    });
    return albums;
  }

  searchTracks(artistList, partialName) {
    let tracks = [];

    artistList.forEach((artist) => {
      artist.albums.forEach((album) => {
        tracks = tracks.concat(
          album.tracks.filter((track) => track.name.toLowerCase().includes(partialName.toLowerCase()))
        );
      });
    });

    return tracks;
  }
  searchPlaylists(playLists, partialName) {
    return playLists.filter((playlist) => playlist.name.includes(partialName));
  }

  searchTracksByArtist(artistList, artistId) {
    const artist = this.searchArtist(artistList, artistId);
    return artist.albums.reduce((acc, album) => acc.concat(album.tracks), []);
  }

  searchTracksByGenres(artistList, genres) {
    const tracks = [];

    artistList.forEach((artist) => {
      artist.albums.forEach((album) => {
        album.tracks.forEach((track) => {
          if (genres.some((genre) => track.genres.includes(genre))) {
            tracks.push(track);
          }
        });
      });
    });

    // eslint-disable-next-line no-undef
    return [...new Set(tracks)];
  }

  existsArtistNamed(artistList, artistName) {
    return artistList.some(
      (artist) => artist.name.toLowerCase() === artistName.toLowerCase()
    );
  }

  existsAlbumNamed(albumList, albumName) {
    return albumList.some(
      (album) => album.name.toLowerCase() === albumName.toLowerCase()
    );
  }

  existsTrackNamed(trackList, trackName) {
    return trackList.some(
      (track) => track.name.toLowerCase() === trackName.toLowerCase()
    );
  }

  topThreeListenedTracksByArtist(artistList, userList, artistId) {
    let artistTracks = this.searchTracksByArtist(artistList, artistId);

    //mapeo la lista de tracks del artista con una lista de tuplas que tienen el track y la cantidad de veces q se escucho
    artistTracks = artistTracks.map((track) => {
      return [track, this.timesListenedTrack(track, userList)];
    });

    //ordeno la lista de tuplas segun la cantidad de veces que se escucho el track
    artistTracks = artistTracks.sort((trackTupleA, trackTupleB) => {
      if (trackTupleA[1] < trackTupleB[1]) {
        return 1;
      }
      if (trackTupleA[1] > trackTupleB[1]) {
        return -1;
      }
      return 0;
    });

    //retorno los 3 temas mas escuchados
    return artistTracks.slice(0, 3).map((trackTuple) => trackTuple[0]);
  }

  timesListenedTrack(aTrack, userList) {
    return userList.reduce(
      (accum, user) => accum + user.timesListened(aTrack),
      0
    );
  }

  searchByName(unqfy, aString) {
    const tempObj = { artists: [], albums: [], tracks: [], playlists: [] };
    tempObj.artists = this.searchArtists(unqfy.artists, aString);
    tempObj.albums = this.searchAlbums(unqfy.artists, aString);
    tempObj.tracks = this.searchTracks(unqfy.artists, aString);
    tempObj.playlists = this.searchPlaylists(unqfy.playlists, aString);
    return tempObj;
  }

  listenedTracks(unqfy, userId) {
    const tempUser = unqfy.getUserById(userId);
    return tempUser.getListenedTracks();
  }

  timesListenedByUser(unqfy, userId, trackId) {
    const tempUser = unqfy.getUserById(userId);
    const tempTrack = unqfy.getTrackById(trackId);
    return tempUser.timesListened(tempTrack);
  }

  searchPlaylistsCustom(playlists, searchData) {
    function nameFilter(playlist) {
      return searchData.name === undefined || playlist.name.toLowerCase().includes(searchData.name.toLowerCase());
    }

    function durationLTFilter(playlist) {
      return searchData.durationLT === undefined || playlist.duration < searchData.durationLT;
    }

    function durationGTFilter(playlist) {
      return searchData.durationGT === undefined || playlist.duration > searchData.durationGT;
    }

    return playlists.filter(playlst => (nameFilter(playlst) && durationLTFilter(playlst) && durationGTFilter(playlst)));
  }
}
module.exports = Searcher;