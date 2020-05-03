const Printer = require('./printer');
const {NoMatchingAlbumException, NoMatchingArtistException,
  NoMatchingTrackException, NoMatchingPlaylistException} = require('./exceptions.js');

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
      getPlaylists: function(unqfy) {
        printer.printArray('Playlists de UNQfy', unqfy.playlists);
      },
      //formato: getArtist artistId
      getArtist: function(unqfy) {
        const artist = unqfy.getArtistById(commandArgs[1]);
        try {
          if (artist === undefined) {
            throw new NoMatchingArtistException(commandArgs[1]);
          } else {
            printer.printEntity(`Artista de id ${commandArgs[1]}`, artist);
          }
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: getAlbum albumId
      getAlbum: function(unqfy) {
        const album = unqfy.getAlbumById(commandArgs[1]);
        try {
          if (album === undefined) {
            throw new NoMatchingAlbumException(commandArgs[1]);
          } else {
            printer.printEntity(`Album de id ${commandArgs[1]}`, album);
          }
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: getTrack trackId
      getTrack: function(unqfy) {
        const track = unqfy.getTrackById(commandArgs[1]);
        try {
          if (track === undefined) {
            throw new NoMatchingTrackException(commandArgs[1]);
          } else {
            printer.printEntity(`Track de id ${commandArgs[1]}`, track);
          }
        } catch (exception) {
          console.error(exception);
        }
      },
      //formato: getPlaylist playlistId
      getPlaylist: function(unqfy) {
        const playlist = unqfy.getPlaylistById(commandArgs[1]);
        try {
          if (playlist === undefined) {
            throw new NoMatchingPlaylistException(commandArgs[1]);
          } else {
            printer.printEntity(`Playlist de id ${commandArgs[1]}`, playlist);
          }
        } catch (exception) {
          console.error(exception);
        }
      },

      // SEARCHERS
      //formato: getTracksByArtist artistId
      getTracksByArtist: function(unqfy) {
        const artist = unqfy.getArtistById(commandArgs[1]);
        try {
          if (artist === undefined) {
            throw new NoMatchingArtistException(commandArgs[1]);
          } else {
            printer.printArray(`Tracks del artista de id ${commandArgs[1]}`, unqfy.getTracksMatchingArtist(artist));
          }
        } catch (error) {
          console.error(error);
        }
      },
      //formato: getTracksByGenres genre1 genre2 .. genreN
      getTracksByGenres: function(unqfy) {
        printer.printArray(`Tracks de los siguientes generos: ${this._command.splice(1)}`, unqfy.getTracksMatchingGenres(this._command.splice(1)));
      },
      //formato: searchAllPartialName stringToSearch
      searchAllPartialName: function(unqfy) {
        const allMatches = unqfy.searchByName(commandArgs[1]);
        printer.printArray('Artistas encontrados', allMatches.artists);
        printer.printArray('Albumes encontrados', allMatches.albums);
        printer.printArray('Tracks encontrados', allMatches.tracks);
        printer.printArray('Playlists encontrados', allMatches.playlists);
      },

      // CUSTOMS
      //formato: generatePlaylists playlistName maxDuration genre1 genre2 .. genreN
      generatePlaylists: function(unqfy) {
        printer.printEntity('Playlist generado', unqfy.createPlaylist(commandArgs[1], this._command.slice(3), this._command[2]));
      }

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