const Playlist = require('./playlist.js');

class PlaylistGenerator {
    constructor() {
        this._playlistId = 0;
    }

    generate(aName, maxDuration, genres, artistList, searcher) {
        const playlistTracks = searcher.searchTracksByGenres(artistList, genres);
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
        
        return new Playlist(this._playlistId++, aName, playlistTracks);
    }
}
module.exports = PlaylistGenerator;