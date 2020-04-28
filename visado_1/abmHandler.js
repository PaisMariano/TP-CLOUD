const Artist = require('./artist.js');
const Album = require('./album.js');
const Track = require('./track.js');

class AbmHandler {
    constructor(){
        this._artistId  = 0; // preguntar si se deberia pasar por parametro
        this._albumId   = 0; // preguntar si se deberia pasar por parametro
        this._trackId   = 0; // preguntar si se deberia pasar por parametro
    }
      
    get artistId(){return this._artistId;}
    get albumId(){return this._albumId;}
    get trackId(){return this._trackId;}

    createArtist(aName, aCountry){
        this._artistId = this._artistId + 1;
        return new Artist(this._artistId, aName, aCountry);
    }
    createAlbum(aName, aYear, anArtist){
        this._albumId = this._albumId + 1;
        return new Album(this._albumId, aName, aYear, anArtist);
    }
    createTrack(aName, genres, aDuration, anAlbum){
        this._trackId = this._trackId + 1;
        return new Track(this._trackId, aName, genres, aDuration, anAlbum);
    }
    updateArtist(anArtist, aName, aCountry){
        anArtist.name    = aName;
        anArtist.country = aCountry;
    }

    updateAlbum(anAlbum, aName, anYear){
        anAlbum.name = aName;
        anAlbum.year = anYear;
    }

    updateTrack(aTrack, aName, genres, aDuration){
        aTrack.name     = aName;
        aTrack.genres   = genres;
        aTrack.duration = aDuration;
    }

    deleteArtist(artistList, anArtist){ 
        return artistList.filter(art => art.id !== anArtist.id);
    }

    deleteAlbum(artistList, anAlbum){
        return artistList.map(art => {
            art.albums = art.albums.filter(album => album.id !== anAlbum.id);
            return art
        });
    }
    deleteTrack(artistList, aTrack){
        return artistList.map(art => {
            art.albums = art.albums.map(album => {
                album.tracks = album.tracks.filter(track => track.id !== aTrack.id);
                return album;
            })
            return art;
        });
    }    
}

module.exports = AbmHandler;