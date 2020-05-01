const Playlist = require('./playlist.js');

class PlaylistGenerator {
    constructor() {
        this._playlistId = 0;
    }
    createPlaylist(unqfy, playlistData){
        this._playlistId = this._playlistId + 1;
        let tempPlaylist = new Playlist(this._playlistId, 
                                        playlistData.name, 
                                        playlistData.tracks);
        unqfy.playlists.push(tempPlaylist);
        return tempPlaylist;
    }
    generate(aName, maxDuration, genres, unqfy){
        const playlistTracks = unqfy.searcher.searchTracksByGenres(unqfy.artists, genres);
        const unSortedPlaylist = this.generateUnsorted(playlistTracks, maxDuration);
        const duration = unSortedPlaylist.reduce((sum, curDur) => sum + curDur.duration, 0);
        let tempPlaylist = new Playlist(this._playlistId++, aName, duration, unSortedPlaylist);
        unqfy.playlists.push(tempPlaylist);
        return tempPlaylist;
    }
    generateUnsorted(aList, maxDuration){
        let tempList = [];
        let aDuration = maxDuration;
        let currentIndex = aList.length, randomIndex, tempDuration;
        while (aDuration > 0 && aList.length > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            tempDuration = aList[randomIndex].duration;
            if(tempDuration <= aDuration){
                aDuration = aDuration - tempDuration;
                tempList = tempList.concat(aList.splice(randomIndex, 1));
            }else{
                aList.splice(randomIndex, 1);
            }
        }        
        return tempList;
    }

}
module.exports = PlaylistGenerator;