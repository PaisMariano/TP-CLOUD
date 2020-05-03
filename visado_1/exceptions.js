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

module.exports = {
  NoMatchingAlbumException,
  NoMatchingArtistException,
  NoMatchingTrackException,
  NoMatchingPlaylistException
};