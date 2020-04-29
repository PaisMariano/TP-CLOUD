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

    //FEDE TE MODIFIQUE PARA PASAR UNQFY Y AGREGARSELO A SU LISTA DE PLAYLIST PERDONNNNN
    generate(aName, maxDuration, genres, unqfy) {
        const playlistTracks = unqfy.searcher.searchTracksByGenres(unqfy.artists, genres);
        let currentDuration = playlistTracks.reduce((accum, track) => accum + track.duration, 0);

        //version de algoritmo no optima, porque no busca que la duracion sea lo mas cercana posible a "maxDuration"
        //a cambio de eso, es muy rapida la generacion de la playlist
        while(currentDuration > maxDuration) {
            currentDuration -= playlistTracks.shift().duration;
        }
        
        // if (currentDuration > maxDuration) {
        //     let remainderDuration = currentDuration - maxDuration;
        //     playlistTracks.forEach(track => {
        //         if (currentDuration > 0) {
        //             remainderDuration -= track.duration;
        //             playlistTracks.shift();
        //         }
        //     })
        // }

        let tempPlaylist = new Playlist(this._playlistId++, aName, playlistTracks);
        unqfy.playlists.push(tempPlaylist);
        return tempPlaylist;
    }
}
module.exports = PlaylistGenerator;