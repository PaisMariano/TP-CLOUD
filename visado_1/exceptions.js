class NoMatchingAnythingException extends Error {
  constructor(anythingId, anything) {
    super(`No existe un ${anything} con el id ${anythingId}.`);
  }
}

class NoMatchingArtistException extends NoMatchingAnythingException {
  constructor(artistId) {
    super(artistId, 'artista');
    this.name = NoMatchingArtistException;
  }
}

class NoMatchingAlbumException extends NoMatchingAnythingException {
  constructor(albumId) {
    super(albumId, 'album');
    this.name = NoMatchingAlbumException;
  }
}

class NoMatchingTrackException extends NoMatchingAnythingException {
  constructor(trackId) {
    super(trackId, 'track');
    this.name = NoMatchingTrackException;
  }
}

class NoMatchingPlaylistException extends NoMatchingAnythingException {
  constructor(playlistId) {
    super(playlistId, 'playlist');
    this.name = NoMatchingPlaylistException;
  }
}

class NoMatchingUserException extends NoMatchingAnythingException {
  constructor(userId) {
    super(userId, 'playlist');
    this.name = NoMatchingUserException;
  }
}

class AlreadyExistsException extends Error {
  constructor(anythingName, anything) {
    super(`Ya existe un ${anything} con el nombre ${anythingName}.`);
  }
}

class AlreadyExistsArtistException extends AlreadyExistsException {
  constructor(artistName) {
    super(artistName, 'artista');
    this.name = AlreadyExistsArtistException;
  }
}

class AlreadyExistsAlbumException extends AlreadyExistsException {
  constructor(albumName) {
    super(albumName, 'album');
    this.name = AlreadyExistsAlbumException;
  }
}

class AlreadyExistsTrackException extends AlreadyExistsException {
  constructor(trackName) {
    super(trackName, 'track');
    this.name = AlreadyExistsTrackException;
  }
}

class AlreadyExistsPlaylistException extends AlreadyExistsException {
  constructor(playlistName) {
    super(playlistName, 'track');
    this.name = AlreadyExistsPlaylistException;
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
  AlreadyExistsPlaylistException
};