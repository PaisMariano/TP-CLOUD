const Printer = require('./printer');
const {MissingArgsInCommand} = require('./exceptions');

class CommandHandler {
  constructor(args) {
    this._command = args;
    this._printer = new Printer();
  }

  validCommands() {
    const commandArgs = this._command;
    const printer = this._printer;
    return {
    // CREATORS
    //formato: addArtist name country
      addArtist: [function(unqfy) {
        const artistData = {
          name: commandArgs[1],
          country: commandArgs[2],
        };

        try {
          const artist = unqfy.addArtist(artistData);
          printer.printMessage(`Nuevo artista (con id: ${artist.id}) creado exitosamente`);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 3],
      //formato: addAlbum name artistId year
      addAlbum: [function(unqfy) {
        const albumData = {
          name: commandArgs[1],
          year: Number(commandArgs[3])
        };

        try {
          const album = unqfy.addAlbum(Number(commandArgs[2]), albumData);
          printer.printMessage(`Nuevo album (con id: ${album.id}) creado exitosamente`);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 4],
      //formato: addTrack name albumId duration genre1 genre2 .. genreN
      addTrack: [function(unqfy) {
        const trackData = {
          name: commandArgs[1],
          duration: Number(commandArgs[3]),
          genres: commandArgs.slice(4)
        };

        try {
          const track = unqfy.addTrack(Number(commandArgs[2]), trackData);
          printer.printMessage(`Nuevo track (con id: ${track.id}) creado exitosamente`);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 4],
      //formato: addUser name
      addUser: [function(unqfy) {
        const userData = {
          name: commandArgs[1]
        };

        try {
          const user = unqfy.addUser(userData);
          printer.printMessage(`Nuevo usuario (con id: ${user.id}) creado exitosamente`);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],

      // DELETERS
      //formato: deleteArtist artistId
      deleteArtist: [function(unqfy) {
        unqfy.removeArtist(Number(commandArgs[1]));
        printer.printMessage('Se eliminó el artista correctamente.');
      }, 2],
      //formato: deleteAlbum albumId
      deleteAlbum: [function(unqfy) {
        unqfy.removeAlbum(Number(commandArgs[1]));
        printer.printMessage('Se eliminó el album correctamente.');
      }, 2],
      //formato: deleteTrack trackId
      deleteTrack: [function(unqfy) {
        unqfy.removeTrack(Number(commandArgs[1]));
        printer.printMessage('Se eliminó el track correctamente.');
      }, 2],
      //formato: deletePlaylist playlistId
      deletePlaylist: [function(unqfy) {
        unqfy.removePlaylist(Number(commandArgs[1]));
        printer.printMessage('Se eliminó la playlist correctamente.');
      }, 2],

      // GETTERS
      //formato: getArtists
      getArtists: [function(unqfy) {
        printer.printArray('Artistas de UNQfy', unqfy.artists);
      }, 1],
      //formato: getAlbums artistId
      getAlbums: [function(unqfy) {
        try {
          const albums = unqfy.getArtistById(Number(commandArgs[1])).albums;
          printer.printArray(`Albums del artista de id ${commandArgs[1]}`, albums);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],
      //formato: getTracks albumId
      getTracks: [function(unqfy) {
        try {
          const tracks = unqfy.getAlbumById(Number(commandArgs[1])).tracks;
          printer.printArray(`Tracks del album de id ${commandArgs[1]}`, tracks);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],
      //formato: getPlaylists
      getPlaylists: [function(unqfy) {
        printer.printArray('Playlists de UNQfy', unqfy.playlists);
      }, 1],
      //formato: getUsers
      getUsers: [function(unqfy) {
        printer.printArray('Users de UNQfy', unqfy.users);
      }, 1],
      //formato: getArtist artistId
      getArtist: [function(unqfy) {
        try {
          const artist = unqfy.getArtistById(Number(commandArgs[1]));
          printer.printEntity(`Artista de id ${commandArgs[1]}`, artist);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],
      //formato: getAlbum albumId
      getAlbum: [function(unqfy) {
        try {
          const album = unqfy.getAlbumById(Number(commandArgs[1]));
          printer.printEntity(`Album de id ${commandArgs[1]}`, album);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],
      //formato: getTrack trackId
      getTrack: [function(unqfy) {
        try {
          const track = unqfy.getTrackById(Number(commandArgs[1]));
          printer.printEntity(`Track de id ${commandArgs[1]}`, track);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],
      //formato: getPlaylist playlistId
      getPlaylist: [function(unqfy) {
        try {
          const playlist = unqfy.getPlaylistById(Number(commandArgs[1]));
          printer.printEntity(`Playlist de id ${commandArgs[1]}`, playlist);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],
      //formato: getUser userId
      getUser: [function(unqfy) {
        try {
          const user = unqfy.getUserById(Number(commandArgs[1]));
          printer.printEntity(`User de id ${commandArgs[1]}`, user);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],

      // SEARCHERS
      //formato: getTracksByArtist artistId
      getTracksByArtist: [function(unqfy) {
        try {
          const artist = unqfy.getArtistById(Number(commandArgs[1]));
          printer.printArray(`Tracks del artista de id ${commandArgs[1]}`, unqfy.getTracksMatchingArtist(artist));
        } catch (error) {
          printer.printException(error);
        }
      }, 2],
      //formato: getTracksByGenres genre1 genre2 .. genreN
      getTracksByGenres: [function(unqfy) {
        printer.printArray(`Tracks de los siguientes generos: ${commandArgs.slice(1)}`, unqfy.getTracksMatchingGenres(commandArgs.slice(1)));
      }, 1],
      //formato: searchAllPartialName stringToSearch
      searchAllPartialName: [function(unqfy) {
        const allMatches = unqfy.searchByName(commandArgs[1]);
        printer.printArray('Artistas encontrados', allMatches.artists);
        printer.printArray('Albumes encontrados', allMatches.albums);
        printer.printArray('Tracks encontrados', allMatches.tracks);
        printer.printArray('Playlists encontrados', allMatches.playlists);
      }, 2],
      //formato: searchTracksPartialName stringToSearch
      searchTracksPartialName: [function(unqfy) {
        printer.printArray('Tracks encontrados', unqfy.getPartialMatchingTracks(commandArgs[1])); 
      }, 2],
      //formato: searchAlbumsPartialName stringToSearch
      searchAlbumsPartialName: [function(unqfy) {
        printer.printArray('Albumes encontrados', unqfy.getPartialMatchingAlbums(commandArgs[1]));
      }, 2],
      //formato: searchArtistsPartialName stringToSearch
      searchArtistsPartialName: [function(unqfy) {
        printer.printArray('Artistas encontrados', unqfy.getPartialMatchingArtists(commandArgs[1]));
      }, 2],
      //formato: searchPlaylistsPartialName stringToSearch
      searchPlaylistsPartialName: [function(unqfy) {
        printer.printArray('Playlists encontrados', unqfy.getPartialMatchingPlaylists(commandArgs[1]));
      }, 2],
      //formato: getListenedTracksByUser userId
      getListenedTracksByUser: [function(unqfy) {
        try {
          const tracks = unqfy.listenedTracks(Number(commandArgs[1]));
          printer.printArray(`Tracks escuchados por el usuario de id ${commandArgs[1]}`, tracks);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],

      // CUSTOMS
      //formato: timesListenedTrackByUser userId trackId
      timesListenedTrackByUser: [function(unqfy) {
        try {
          const timesListened = unqfy.timesListened(Number(commandArgs[1]), Number(commandArgs[2]));
          printer.printMessage(`El usuario de id ${commandArgs[1]} escuchó el track de id ${commandArgs[2]}, ${timesListened} veces`);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 3],
      //formato: top3TracksFromArtist artistId
      top3TracksFromArtist: [function(unqfy) {
        try {
          const tracks = unqfy.artistTopThreeTracks(Number(commandArgs[1]));
          printer.printArray(`Top 3 Tracks del artista de id ${commandArgs[1]}`, tracks);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 2],
      //formato: generatePlaylist name maxDuration genre1 genre2 .. genreN
      generatePlaylist: [function(unqfy) {
        printer.printEntity('Playlist generado', unqfy.createPlaylist(commandArgs[1], commandArgs.slice(3), Number(commandArgs[2])));
      }, 3],
      //formato: userListenTrack userId trackId
      userListenTrack: [function(unqfy) {
        try {
          unqfy.listen(Number(commandArgs[1]), Number(commandArgs[2]));
          printer.printMessage(`El usuario con id ${commandArgs[1]} escuchó el track con id ${commandArgs[2]} correctamente`);
        } catch (exception) {
          printer.printException(exception);
        }
      }, 3],
    };
  }

  executeCommand(unqfy) {
    const commandId = this._command[0];
    if (this.validCommands().hasOwnProperty(commandId)) {
      try {
        this.hasNotEnoughArgsException(this.validCommands()[commandId][1]);
        this.validCommands()[commandId][0](unqfy);
      } catch (exception) {
        // console.log('Excepcion atrapada en executeCommand');
        this._printer.printException(exception);
      }
    } else {
      this._printer.printMessage('Vuelva a intentar con otro comando, el que ingresó no es válido.');
    }
  }

  hasNotEnoughArgsException(amount) {
    if(this._command.length < amount) {
      throw new MissingArgsInCommand(this._command[0]);
    }
  }
}

module.exports = CommandHandler;