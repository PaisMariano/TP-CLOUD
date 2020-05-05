class MissingArgsInCommand extends Error {
  constructor(commandId) {
    super(`No pasó suficientes argumentos para la invocación al comando "${commandId}".`);
    this.name = 'MissingParamsInCommand';
  }
}

class NoMatchingAnythingException extends Error {
  constructor(anythingId, anything) {
    super(`No existe un ${anything} con id ${anythingId}.`);
  }
}

class NoMatchingArtistException extends NoMatchingAnythingException {
  constructor(artistId) {
    super(artistId, 'artista');
    this.name = 'NoMatchingArtistException';
  }
}

class NoMatchingAlbumException extends NoMatchingAnythingException {
  constructor(albumId) {
    super(albumId, 'album');
    this.name = 'NoMatchingAlbumException';
  }
}

class NoMatchingTrackException extends NoMatchingAnythingException {
  constructor(trackId) {
    super(trackId, 'track');
    this.name = 'NoMatchingTrackException';
  }
}

class NoMatchingPlaylistException extends NoMatchingAnythingException {
  constructor(playlistId) {
    super(playlistId, 'playlist');
    this.name = 'NoMatchingPlaylistException';
  }
}

class NoMatchingUserException extends NoMatchingAnythingException {
  constructor(userId) {
    super(userId, 'user');
    this.name = 'NoMatchingUserException';
  }
}

class AlreadyExistsException extends Error {
  constructor(anythingName, ...anything) {
    if (anything.length === 1) {
      super(`Ya existe un ${anything[0]} con nombre ${anythingName}.`);
    } else {
      super(`Ya existe un ${anything[0]} con nombre ${anythingName} para el ${anything[1]} de id ${anything[2]}.`);
    }
  }
}

class AlreadyExistsArtistException extends AlreadyExistsException {
  constructor(artistName) {
    super(artistName, 'artista');
    this.name = 'AlreadyExistsArtistException';
  }
}

class AlreadyExistsAlbumException extends AlreadyExistsException {
  constructor(albumName, artistId) {
    super(albumName, 'album', 'artista', artistId);
    this.name = 'AlreadyExistsAlbumException';
  }
}

class AlreadyExistsTrackException extends AlreadyExistsException {
  constructor(trackName, albumId) {
    super(trackName, 'track', 'album', albumId);
    this.name = 'AlreadyExistsTrackException';
  }
}

class AlreadyExistsPlaylistException extends AlreadyExistsException {
  constructor(playlistName) {
    super(playlistName, 'track');
    this.name = 'AlreadyExistsPlaylistException';
  }
}

module.exports = {
  NoMatchingAlbumException,
  NoMatchingArtistException,
  NoMatchingTrackException,
  NoMatchingPlaylistException,
  NoMatchingUserException,
  AlreadyExistsArtistException,
  AlreadyExistsAlbumException,
  AlreadyExistsTrackException,
  AlreadyExistsPlaylistException,
  MissingArgsInCommand
};