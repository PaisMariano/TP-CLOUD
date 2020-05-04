const Printer = require('./printer');

class CommandHandler {
  constructor(args) {
    this._command = args;
    this._printer = new Printer();
  }

  validCommands(commandArgs, printer) {
    return {
    // CREATORS
    //formato: addArtist name country
      addArtist: function(unqfy) {
        const artistData = {
          name: commandArgs[1],
          country: commandArgs[2],
        };

        try {
          const artist = unqfy.addArtist(artistData);
          printer.printMessage(`Nuevo artista (con id: ${artist.id}) creado exitosamente`);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: addAlbum name artistId year
      addAlbum: function(unqfy) {
        const albumData = {
          name: commandArgs[1],
          year: commandArgs[3]
        };

        try {
          const album = unqfy.addAlbum(commandArgs[2], albumData);
          printer.printMessage(`Nuevo album (con id: ${album.id}) creado exitosamente`);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: addTrack name albumId duration genre1 genre2 .. genreN
      addTrack: function(unqfy) {
        const trackData = {
          name: commandArgs[1],
          duration: commandArgs[3],
          genres: commandArgs.splice(4)
        };

        try {
          const track = unqfy.addTrack(commandArgs[2], trackData);
          printer.printMessage(`Nuevo track (con id: ${track.id}) creado exitosamente`);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: addUser name
      addUser: function(unqfy) {
        const userData = {
          name: commandArgs[1]
        };

        try {
          const user = unqfy.addUser(userData);
          printer.printMessage(`Nuevo usuario (con id: ${user.id}) creado exitosamente`);
        } catch (exception) {
          console.error(exception);
        }
      },

      // DELETERS
      //formato: deleteArtist artistId
      deleteArtist: function(unqfy) {
        unqfy.removeArtist(commandArgs[1]);
        printer.printMessage('Se eliminó el artista correctamente.');
      },
      //formato: deleteAlbum albumId
      deleteAlbum: function(unqfy) {
        unqfy.removeAlbum(commandArgs[1]);
        printer.printMessage('Se eliminó el album correctamente.');
      },
      //formato: deleteTrack trackId
      deleteTrack: function(unqfy) {
        unqfy.removeTrack(commandArgs[1]);
        printer.printMessage('Se eliminó el track correctamente.');
      },
      //formato: deletePlaylist playlistId
      deletePlaylist: function(unqfy) {
        unqfy.removePlaylist(commandArgs[1]);
        printer.printMessage('Se eliminó la playlist correctamente.');
      },

      // GETTERS
      //formato: getArtists
      getArtists: function(unqfy) {
        printer.printArray('Artistas de UNQfy', unqfy.artists);
      },
      //formato: getAlbums artistId
      getAlbums: function(unqfy) {
        printer.printArray(`Albums del artista de id ${commandArgs[1]}`, unqfy.getArtistById(commandArgs[1]).albums);
      },
      //formato: getTracks albumId
      getTracks: function(unqfy) {
        printer.printArray(`Tracks del album de id ${commandArgs[1]}`, unqfy.getAlbumById(commandArgs[1]).tracks);
      },
      //formato: getPlaylists
      getPlaylists: function(unqfy) {
        printer.printArray('Playlists de UNQfy', unqfy.playlists);
      },
      //formato: getArtist artistId
      getArtist: function(unqfy) {
        try {
          const artist = unqfy.getArtistById(commandArgs[1]);
          printer.printEntity(`Artista de id ${commandArgs[1]}`, artist);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: getAlbum albumId
      getAlbum: function(unqfy) {
        try {
          const album = unqfy.getAlbumById(commandArgs[1]);
          printer.printEntity(`Album de id ${commandArgs[1]}`, album);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: getTrack trackId
      getTrack: function(unqfy) {
        try {
          const track = unqfy.getTrackById(commandArgs[1]);
          printer.printEntity(`Track de id ${commandArgs[1]}`, track);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: getPlaylist playlistId
      getPlaylist: function(unqfy) {
        try {
          const playlist = unqfy.getPlaylistById(commandArgs[1]);
          printer.printEntity(`Playlist de id ${commandArgs[1]}`, playlist);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: getUser userId
      getUser: function(unqfy) {
        try {
          const user = unqfy.getUserById(commandArgs[1]);
          printer.printEntity(`User de id ${commandArgs[1]}`, user);
        } catch (exception) {
          console.error(exception);
        }
      },

      // SEARCHERS
      //formato: getTracksByArtist artistId
      getTracksByArtist: function(unqfy) {
        try {
          const artist = unqfy.getArtistById(commandArgs[1]);
          printer.printArray(`Tracks del artista de id ${commandArgs[1]}`, unqfy.getTracksMatchingArtist(artist));
        } catch (error) {
          console.error(error);
        }
      },
      //formato: getTracksByGenres genre1 genre2 .. genreN
      getTracksByGenres: function(unqfy) {
        printer.printArray(`Tracks de los siguientes generos: ${commandArgs.splice(1)}`, unqfy.getTracksMatchingGenres(commandArgs.splice(1)));
      },
      //formato: searchAllPartialName stringToSearch
      searchAllPartialName: function(unqfy) {
        const allMatches = unqfy.searchByName(commandArgs[1]);
        printer.printArray('Artistas encontrados', allMatches.artists);
        printer.printArray('Albumes encontrados', allMatches.albums);
        printer.printArray('Tracks encontrados', allMatches.tracks);
        printer.printArray('Playlists encontrados', allMatches.playlists);
      },
      //formato: searchTracksPartialName stringToSearch
      searchTracksPartialName: function(unqfy) {
        printer.printArray('Tracks encontrados', unqfy.getPartialMatchingTracks(commandArgs[1])); 
      },
      //formato: searchAlbumsPartialName stringToSearch
      searchAlbumsPartialName: function(unqfy) {
        printer.printArray('Albumes encontrados', unqfy.getPartialMatchingAlbums(commandArgs[1]));
      },
      //formato: searchArtistsPartialName stringToSearch
      searchArtistsPartialName: function(unqfy) {
        printer.printArray('Artistas encontrados', unqfy.getPartialMatchingArtists(commandArgs[1]));
      },
      //formato: searchPlaylistsPartialName stringToSearch
      searchPlaylistsPartialName: function(unqfy) {
        printer.printArray('Playlists encontrados', unqfy.getPartialMatchingPlaylists(commandArgs[1]));
      },
      //formato: getListenedTracksByUser userId
      getListenedTracksByUser: function(unqfy) {
        try {
          const tracks = unqfy.listenedTracks(commandArgs[1]);
          printer.printArray(`Tracks escuchados por el usuario de id ${commandArgs[1]}`, tracks);
        } catch (exception) {
          console.error(exception);
        }
      },

      // CUSTOMS
      //formato: timesListenedTrackByUser userId trackId
      timesListenedTrackByUser: function(unqfy) {
        try {
          const timesListened = unqfy.timesListened(commandArgs[1], commandArgs[2]);
          printer.printMessage(`El usuario de id ${commandArgs[1]} escuchó el track de id ${commandArgs[2]} ${timesListened} veces`);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: top3TracksFromArtist artistId
      top3TracksFromArtist: function(unqfy) {
        try {
          const tracks = unqfy.artistTopThreeTracks(commandArgs[1]);
          printer.printArray(`Top 3 Tracks del artista de id ${commandArgs[1]}`, tracks);
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: generatePlaylist name maxDuration genre1 genre2 .. genreN
      generatePlaylist: function(unqfy) {
        printer.printEntity('Playlist generado', unqfy.createPlaylist(commandArgs[1], commandArgs.slice(3), commandArgs[2]));
      },
      //formato: userListenTrack userId trackId
      userListenTrack: function(unqfy) {
        try {
          unqfy.listen(commandArgs[1], commandArgs[2]);
          printer.printMessage(`El usuario con id ${commandArgs[1]} escuchó el track con id ${commandArgs[2]} correctamente`);
        } catch (exception) {
          console.error(exception);
        }
      },

    };
  }

  executeCommand(unqfy) {
    const commandId = this._command[0];
    if (this.validCommands(this._command, this._printer).hasOwnProperty(commandId)) {
      this.validCommands(this._command, this._printer)[commandId](unqfy);
    } else {
      this._printer.printMessage('Vuelva a intentar con otro comando, el que ingresó no es válido.');
    }
  }
}

module.exports = CommandHandler;