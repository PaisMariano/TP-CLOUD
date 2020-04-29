const Artist = require('./artist.js');
const Album = require('./album.js');
const Track = require('./track.js');

class AbmHandler {
    constructor(){
        this._artistId  = 0;
        this._albumId   = 0;
        this._trackId   = 0;
    }
      
    get artistId(){return this._artistId;}
    get albumId(){return this._albumId;}
    get trackId(){return this._trackId;}

    createArtist(unqfy, artistData){
        this._artistId = this._artistId + 1;
        if (!unqfy.searcher.existsArtistNamed(unqfy.artists, artistData.name)){
            let tempArtist = new Artist(this._artistId, artistData.name, artistData.country);
            unqfy.artists.push(tempArtist);
        }else{
            throw Error("Ya existe un artista con ese nombre.");
        }
        return tempArtist;
    }
    createAlbum(unqfy, artistId, albumData){
        this._albumId   = this._albumId + 1;
        let tempArtist  = unqfy.getArtistById(artistId);
        if (!unqfy.searcher.existsAlbumNamed(tempArtist.albums, albumData.name)){
            let tempAlbum   = new Album(this._albumId, albumData.name, albumData.year, tempArtist);
            tempArtist.albums.push(tempAlbum);
        }else{
            throw Error("Ya existe un album con ese nombre para ese artista.")
        }
        return tempAlbum;
    }
    createTrack(unqfy, albumId, trackData){
        this._trackId = this._trackId + 1;
        let tempAlbum = unqfy.getAlbumById(albumId);
        if (!unqfy.searcher.existsTrackNamed(tempAlbum.tracks, trackData.name)){
            let tempTrack = new Track(  trackData.name, 
                                        trackData.genres, 
                                        trackData.duration, 
                                        tempAlbum);
            tempAlbum.tracks.push(tempTrack);
        }else{
            throw Error("Ya existe un track con ese nombre en el Album.")
        }
        return tempTrack;
    }
    updateArtist(unqfy, artistId, artistData){
        let tempArtist  = unqfy.getArtistById(artistId);
        tempArtist.name = artistData.name;
        tempArtist.country  = artistData.country;
    }
    updateAlbum(unqfy, albumId, albumData){
        let tempAlbum  = unqfy.getAlbumById(albumId);
        tempAlbum.name = albumData.name;
        tempAlbum.year = albumData.year;
    }
    updateTrack(unqfy, trackId, trackData){
        let tempTrack      = unqfy.getTrackById(trackId);
        tempTrack.name     = trackData.name;
        tempTrack.genres   = trackData.genres;
        tempTrack.duration = trackData.duration;
    }
    deleteArtist(unqfy, artistId){
        unqfy.artists = unqfy.artists.filter(art => art.id !== artistId);
    }
    deleteAlbum(unqfy, albumId){
        unqfy.artists = 
            unqfy.artists.map(art => {
                art.albums = art.albums.filter(album => album.id !== albumId);
                return art;
            });
    }
    deleteTrack(unqfy, trackId){
        unqfy.artists = 
            unqfy.artists.map(art => {
            art.albums = art.albums.map(album => {
                album.tracks = album.tracks.filter(track => track.id !== trackId);
                return album;
            })
            return art;
        });
    }    
}

module.exports = AbmHandler;