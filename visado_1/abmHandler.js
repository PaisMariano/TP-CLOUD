class AbmHandler {
    constructor(){
        this._artistId  = 0;
        this._albumId   = 0;
        this._trackId   = 0;
    }
      
    get artistId(){return this._artistId;}
    get albumId(){return this._albumId;}
    get trackId(){return this._trackId;}

    createArtist(aName, aCountry){
        this._artistId = this._artistId + 1;
        return new Artist(_artistId, aName, aCountry);
    }
    createAlbum(aName, aYear, anArtist){
        this._albumId = this._albumId + 1;
        return new Album(_albumId, aName, aYear, anArtist);
    }
    createTrack(aName, genres, aDuration, anAlbum){
        this._trackId = this._trackId + 1;
        return new Track(_trackId, aName, genres, aDuration, anAlbum);
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

    deleteArtist(artistList, playlist, listened, anArtist){
        anArtist.albums.forEach(elem =>{
            playlist = playlist.filter(track => track.album.id !== elem.id);
            listened = listened.filter(track => track.album.id !== elem.id);
        })        
        artistList = artistList.filter(art => art.id !== anArtist.id);
    }

    deleteAlbum(artistList, playlist, listened, anAlbum){
        playlist = playlist.filter(track => track.album.id !== anAlbum.id);
        listened = listened.filter(track => track.album.id !== anAlbum.id);
        artistList = artistList.filter(art => {
            art.album.filter(album => album.id !== anAlbum.id)});
    }

    deleteTrack(artistList, playlist, listened, aTrack){
        playlist = playlist.filter(track => track.id !== aTrack.id);
        listened = listened.filter(track => track.id !== aTrack.id);
        artistList = artistList.filter(art => {
            art.albums.filter(album => {
                album.filter(track => track.id !== aTrack.id)
            })
        });
    }
}