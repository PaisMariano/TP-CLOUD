const {
    getUNQfy,
    saveUNQfy
} = require('../persistenceHelpers/picklifyJsonPersistence');
const {
    NoMatchingArtistException,
    NoMatchingAlbumException,
    AlreadyExistsArtistException,
    AlreadyExistsAlbumException,
    NoMatchingTrackException,
    NoMatchingPlaylistException
} = require('../exceptions');

const express     = require('express');        // import express
const artists     = express.Router();
const albums      = express.Router();
const tracks      = express.Router();
const playlists   = express.Router();
const users       = express.Router();
const other       = express.Router();

let unqfy = getUNQfy();

//ENDPOINT /artists/<artistID>
artists.route('/artists/:artistId')
.get((req, res) => {
    const artistId = parseInt(req.params.artistId);
    let tmpArtist;
    try {
        tmpArtist = unqfy.getArtistById(artistId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    res.status(200);
    res.json(
        tmpArtist.toJSON()
    );
})
.put((req, res) => {
    const data = req.body;
    const artistId = parseInt(req.params.artistId);
    let tmpArtist;
    if (data.name === undefined || data.country === undefined){
        let err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }
    try{
        unqfy.updateArtist(artistId, data);
        tmpArtist = unqfy.getArtistById(artistId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(200);
    res.json(
        tmpArtist.toJSON()        
    );
})
.delete((req, res) => {
    const artistId = parseInt(req.params.artistId);
    try{
        unqfy.removeArtist(artistId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(204);
    res.send({
        success: true
    })
})
//ENDPOINT /artists/
artists.route('/artists')
.get((req, res) => {
    let name = req.query.name;
    let tmpArtists;
    //Valido si me pasaron el campo name.
    if (name === undefined){
        name = ""
    }
    try{
        tmpArtists = unqfy.getPartialMatchingArtists(name);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }

    res.status(200);
    res.json(
        tmpArtists.map(artist => artist.toJSON())
    );  
})
.post((req, res) => {
    const data = req.body;
    let tmpArtist;
    if (data.name === undefined || data.country === undefined){
        const err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }
    try {
        tmpArtist = unqfy.addArtist(data);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(201);
    res.json(
        tmpArtist.toJSON()
    );
})

//ENDPOINT /albums/<albumId>
albums.route('/albums/:albumId')
.get((req, res) => {
    const albumId = parseInt(req.params.albumId);
    let tmpAlbum;
    try {  
        tmpAlbum = unqfy.getAlbumById(albumId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    res.status(200);
    res.json(
        tmpAlbum.toJSON()
    );
})
.patch((req, res) => {
    const data = req.body;
    const albumId = parseInt(req.params.albumId);
    if (data.year === undefined){
        const err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }
    try{        
        data.name = unqfy.getAlbumById(albumId).name;
        unqfy.updateAlbum(albumId, data);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }

    const tmpAlbum = unqfy.getAlbumById(albumId);
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(200);
    res.json(
        tmpAlbum.toJSON()
    );
})
.delete((req, res) => {
    const albumId = parseInt(req.params.albumId);
    try{
        unqfy.removeAlbum(albumId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(204);
    res.send({
        success: true
    })
})

//ENDPOINT /albums/
albums.route('/albums')
.get((req, res) => {
    let name = req.query.name;
    let tmpAlbums;
    //Valido si me pasaron el campo name.
    if (name === undefined){
        name = "";
    }
    try{
        tmpAlbums = unqfy.getPartialMatchingAlbums(name);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }

    res.status(200);
    res.json(
        tmpAlbums.map(album => album.toJSON())
    );  
})
.post((req, res) => {
    const data = req.body;
    let tmpAlbum;
    if (data.artistId === undefined || data.name === undefined || data.year === undefined){
        const err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }
    try {
        tmpAlbum = unqfy.addAlbum(data.artistId, data);
    }catch(err){
        if (err instanceof AlreadyExistsAlbumException){
            errorHandler(err, req, res);
        }else{
            const err = new ResourceNotFoundException();
            errorHandler(err, req, res);
        }
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(201);
    res.json(
        tmpAlbum.toJSON()
    );
})

tracks.route('/tracks')
.post((req, res) => {
    const data = req.body;
    let tmpTrack;
    if (data.name === undefined){
        const err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }
    try {
        tmpTrack = unqfy.addTrack(data.albumId, data);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(201);
    res.json(
        tmpTrack.toJSON()
    );
})

tracks.route('/tracks/:trackId/lyrics')
.get((req, res) => {
    const trackId = parseInt(req.params.trackId);
    let tmpTrack;
    try {
        tmpTrack = unqfy.getTrackById(trackId);
        unqfy.getLyrics(trackId)
        .then( lyrics => {
            res.status(200);
            res.json({
                body : {
                    "name":     tmpTrack._name,
                    "lyrics":   lyrics,
                }
            });
        })
        .catch(
            exception => {
                switch(exception.message) {
                    case 'status code != 200':
                        // throw NoRouteException();
                    case 'No hay tracks con ese nombre.':
                        let err = new NoRouteException();
                        errorHandler(err, req, res);
                        break;
                        // throw NoRouteException();
                    default:
                        errorHandler(exception, req, res);
                        // throw exception;
                }
            }
        )
    }catch(err){
        // errorHandler(err, req, res);
        // return;
        if (err instanceof NoMatchingArtistException) {
            let err = new NoRouteException();
            errorHandler(err, req, res);
            return;
            // throw NoRouteException();
        } else {
            errorHandler(err, req, res);
            return;
            // throw err;
        }
    }
})

//ENDPOINT /playlists/<playlistId>
playlists.route('/playlists/:playlistId')
.get((req, res) => {
    const playlistId = parseInt(req.params.playlistId);
    let tmpPlaylist;
    try {
        tmpPlaylist = unqfy.getPlaylistById(playlistId);
    } catch(err) {
        errorHandler(err, req, res);
        return;
    }

    res.status(200);
    res.json(
        tmpPlaylist.toJSON()
    );
})
.delete((req, res) => {
    const playlistId = parseInt(req.params.playlistId);
    try {
        unqfy.removePlaylist(playlistId);
    } catch(err) {
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(204);
    res.send({
        success: true
    });
})

//ENDPOINT /playlists/
playlists.route('/playlists')
.get((req, res) => {
    const name = req.query.name;
    const durationLT = req.query.durationLT;
    const durationGT = req.query.durationGT;

    if (name === undefined && durationLT === undefined && durationGT === undefined) {
        const err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }

    let tmpPlaylists;
    try {
        tmpPlaylists = unqfy.getPlaylistsCustomSearch({
            name,
            durationLT: parseInt(durationLT),
            durationGT: parseInt(durationGT)
        });
    } catch (err) {
        errorHandler(err, req, res);
        return;
    }

    res.status(200);
    res.json(
        tmpPlaylists.map(playlist => playlist.toJSON())
    )
})
.post((req, res) => {
    const name = req.query.name;
    const maxDuration = req.query.maxDuration;
    const genres = req.query.genres;
    const tracks = req.query.tracks;

    let tmpPlaylist;

    if (name !== undefined && tracks !== undefined) {
        try {
            tmpPlaylist = unqfy.addPlaylist({name, tracks});
        } catch (error) {
            if(error instanceof NoMatchingTrackException) {
                const err = new ResourceNotFoundException();
                errorHandler(err, req, res);
            } else {
                const err = new BadRequestException();
                errorHandler(err, req, res);
            }
            return;
        }
    } else if (maxDuration !== undefined && name !== undefined && genres !== undefined){
        try {
            tmpPlaylist = unqfy.createPlaylist(name, genres, parseInt(maxDuration));
        } catch (error) {
            const err = new BadRequestException();
            errorHandler(err, req, res);
            return;
        }
    } else {
        const err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(201);
    res.json(
        tmpPlaylist.toJSON()
    )
})

//ENDPOINT /users/
users.route('/users/:userId')
.get((req, res) => {
    const userId = parseInt(req.params.userId);
    let tmpUser;
    try {  
        tmpUser = unqfy.getUserById(userId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    res.status(200);
    res.json(
        tmpUser.toJSON()
    );
})
.put((req, res) => {
    const data = req.body;
    const userId = parseInt(req.params.userId);
    let tmpUser;
    try{
        unqfy.updateUser(userId, data);
        tmpUser = unqfy.getUserById(userId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(200);
    res.json(
        tmpUser.toJSON()
    );
})
.delete((req, res) => {
    const userId = parseInt(req.params.userId);
    try{
        unqfy.removeUser(userId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    
    res.status(204);
    res.send({
        success: true
    })
})
users.route('/users')
.post((req, res) => {
    const data = req.body;
    let tmpUser;
    if (data.name === undefined || data.name === ""){
        const err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }
    try {
        tmpUser = unqfy.addUser(data);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(201);
    res.json(
        tmpUser.toJSON()
    );
})

users.route('/users/:userId/listenings')
.get((req, res) => {
    const userId = parseInt(req.params.userId);
    let tmpTracks;
    try {        
        tmpTracks = unqfy.listenedTracks(userId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    res.status(200);
    res.json(
        tmpTracks.map(track => track.toJSON())
    );
})
.post((req, res) => {
    const userId = parseInt(req.params.userId);
    const data = req.body;
    let tmpTrack;
    if (data.trackId === undefined){
        const err = new BadRequestException();
        errorHandler(err, req, res);
        return;
    }
    try {
        tmpTrack = unqfy.listen(userId, parseInt(data.trackId));
    }catch(err){
        errorHandler(err, req, res);
        return;
    }

    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(201);
    res.json(
        tmpTrack.toJSON()
    );
})

//Estos deberian quedar abajo de todo.

other.route('*')
.get((req, res) => {
    const err = new NoRouteException();
    errorHandler(err, req, res);
    return;
})
.post((req, res) => {
    const err = new NoRouteException();
    errorHandler(err, req, res);
    return;
})
.delete((req, res) => {
    const err = new NoRouteException();
    errorHandler(err, req, res);
    return;
})
.patch((req, res) => {
    const err = new NoRouteException();
    errorHandler(err, req, res);
    return;
})

function errorHandler(err, req, res) {
    // Chequeamos que tipo de error es y actuamos en consecuencia
    switch(true){
        case (err instanceof NoMatchingArtistException || 
                err instanceof NoMatchingAlbumException || 
                err instanceof NoMatchingPlaylistException ||
                err instanceof NoRouteException):
            res.status(404);
            res.json({
                status: 404,
                errorCode: "RESOURCE_NOT_FOUND"
            });
            break;
        case (err instanceof ResourceNotFoundException):
            res.status(err.status);
            res.json({
                status: err.status,
                errorCode: err.errorCode
            });
            break;
        case (err instanceof AlreadyExistsArtistException || 
                err instanceof AlreadyExistsAlbumException):
            res.status(409);
            res.json({
                status: 409,
                errorCode: "RESOURCE_ALREADY_EXISTS"
            });
            break;
        case (err instanceof BadRequestException):
            res.status(err.status);
            res.json({
                status: err.status,
                errorCode: err.errorCode
            });
            break;
        case (err instanceof InvalidInputError):
            res.status(err.status);
            res.json({
                status: err.status,
                errorCode: err.errorCode
            });
            break;
        case (err !== undefined && err.type === 'entity.parse.failed' || err instanceof SyntaxError):
            // body-parser error para JSON invalido
            res.status(err.status);
            res.json({
                status: err.status,
                errorCode: 'INVALID_JSON'
            });
            break;
        default :
            // continua con el manejador de errores por defecto
            res.status(500);
            res.json({
                status: 500,
                errorCode: "INTERNAL_SERVER_ERROR"
            });
    }
}

class APIError extends Error {
    constructor(name, statusCode, errorCode, message = null) {
        super(message || name);
        this.name = name;
        this.status = statusCode;
        this.errorCode = errorCode;
    }
}
class ResourceNotFoundException extends APIError {
    constructor() {
        super('ResourceNotFoundException', 404, 'RELATED_RESOURCE_NOT_FOUND');
    }
}

class BadRequestException extends APIError{
    constructor() {
        super('BadRequestException', 400, 'BAD_REQUEST');
    }    
}

class InvalidInputError extends APIError {
    constructor() {
        super('InvalidInputError', 400, 'INVALID_INPUT_DATA');
    }  
}

class NoRouteException extends APIError {
    constructor() {
        super('NoRouteException', 404, 'RESOURCE_NOT_FOUND');
    }  
}

module.exports = {
    artists,
    albums,
    tracks,
    playlists,
    users,
    other,
    errorHandler,
    BadRequestException
};