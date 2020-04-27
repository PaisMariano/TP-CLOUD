class Searcher {
    searchArtist(artistList, artistId){
        return artistList.find(elem => elem.id === artistId);
    }

    searchAlbum(artistList, albumId){
        return artistList[0].albums.find(elem => elem.id === albumId);
    }

    searchTrack(artistList, trackId){
        return artistList[0].albums[0].tracks[0];
    }

    searchPlaylist(playlist, playlistId){
        return playlist.tracks[0];
    }
}
module.exports = Searcher;