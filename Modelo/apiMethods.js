let express     = require('express');        // import express
let app         = express();                 // define our app using express
let artists     = express.Router();
let albums      = express.Router();
let tracks      = express.Router();
let playlists   = express.Router();
let users       = express.Router();
let other       = express.Router();
let bodyParser  = require('body-parser');
let unqmod      = require('./unqfy');
const {
    NoMatchingArtistException, 
    NoMatchingAlbumException,
    ResourceAlreadyExistsException,
    AlreadyExistsArtistException,
    AlreadyExistsAlbumException,
    NoMatchingTrackException, 
    NoMatchingPlaylistException,
    NoMatchingUserException
} = require('./exceptions');

let port = 8081;        // set our port

let unqfy = new unqmod.UNQfy();

//ENDPOINT /artists/<artistID>
artists.route('/artists/:artistId')
.get((req, res) => {
    const artistId = parseInt(req.params.artistId);
    let tmpArtist;
    try {
        tmpArtist = unqfy.getArtistById(artistId);
    }catch(err){
        errorHandler(err, req, res);
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
    }
    try{
        unqfy.updateArtist(artistId, data);
        tmpArtist = unqfy.getArtistById(artistId);
    }catch(err){
        errorHandler(err, req, res);
    }    
    
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
    }
    
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
        let err = new BadRequestException();
        errorHandler(err, req, res);
    }
    try {
        tmpArtist = unqfy.addArtist(data);
        unqfy.save('data.json');
    }catch(err){
        errorHandler(err, req, res);
    }

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
        let err = new BadRequestException();
        errorHandler(err, req, res);
    }
    try{        
        data.name = unqfy.getAlbumById(albumId).name;
        unqfy.updateAlbum(albumId, data);
    }catch(err){
        errorHandler(err, req, res);
    }

    let tmpAlbum = unqfy.getAlbumById(albumId);
    
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
    }
    
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
        let err = new BadRequestException();
        errorHandler(err, req, res);
    }
    try {
        tmpAlbum = unqfy.addAlbum(data.artistId, data);
    }catch(err){
        if (err instanceof AlreadyExistsAlbumException){
            errorHandler(err, req, res);
        }else{
            err = new ResourceNotFoundException();
            errorHandler(err, req, res);
        }
    }

    res.status(201);
    res.json(
        tmpAlbum.toJSON()
    );
})

tracks.route('/tracks/:trackId/lyrics')
.get((req, res) => {
    const trackId = parseInt(req.params.trackId);
    let tmpTrack;
    try {        
        unqfy.getLyrics(trackId);
        tmpTrack = unqfy.getTrackById(trackId);
    }catch(err){
        errorHandler(err, req, res);
    }
    res.status(200);
    res.json({
        body : {
            "name":     tmpTrack._name,
            "lyrics":   tmpTrack._lyrics,
        }
    });
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
    }

    res.status(200);
    res.json({
        message: 'Se encontró la playlist.',
        body: tmpPlaylist.toJSON()
    });
})
.delete((req, res) => {
    const playlistId = parseInt(req.params.playlistId);
    try {
        unqfy.removePlaylist(playlistId);
    } catch(err) {
        errorHandler(err, req, res);
    }
    
    res.status(204);
    res.send({
        success: true
    });
})

// //ENDPOINT /api/playlists
// router.route('/playlists')
// .get((req, res) => {
//     let name = req.query.name;
//     let durationLT = req.query.durationLT;
//     let durationGT = req.query.durationGT;
// //     let name = req.query.name;
// //     let tmpAlbums;
// //     //Valido si me pasaron el campo name.
// //     if (name === undefined){
// //         name = "";
// //     }
// //     try{
// //         tmpAlbums = unqfy.getPartialMatchingAlbums(name);
// //     }catch{
// //         errorHandler(err, req, res);
// //     }

// //     res.status("200");
// //     res.json({  
// //         message : 'Álbum/s encontrado/s.', 
// //         body : {
// //             "albums" : tmpAlbums.map(album => album.toJSON())
// //         }
// //     });  
// })
// .post((req, res) => {
//     // const data = req.body;
//     // let tmpAlbum;
//     // if (data.artistId === undefined || data.name === undefined || data.year === undefined){
//     //     let err = new BadRequestException();
//     //     errorHandler(err, req, res);
//     // }
//     // try {
//     //     tmpAlbum = unqfy.addAlbum(data.artistId, data);
//     // }catch(err){
//     //     let err2 = new ResourceNotFoundException();
//     //     errorHandler(err2, req, res);
//     // }

//     // res.status("201");
//     // res.json({  
//     //     message : 'Se creó el álbum correctamente.', 
//     //     body : {
//     //         "id":       tmpAlbum._id ,
//     //         "name":     tmpAlbum._name,
//     //         "year":     tmpAlbum._year,
//     //         "tracks":   tmpAlbum._tracks.map(track => track.toJSON())
//     //     }
//     // });
// })





//Estos deberian quedar abajo de todo.

other.route('*')
.get((req, res) => {
    let err = new NoRouteException();
    errorHandler(err, req, res);
})
.post((req, res) => {
    let err = new NoRouteException();
    errorHandler(err, req, res);
})
.delete((req, res) => {
    let err = new NoRouteException();
    errorHandler(err, req, res);
})
.patch((req, res) => {
    let err = new NoRouteException();
    errorHandler(err, req, res);
})

app.use(bodyParser.json());
app.use('/api', artists, albums, tracks, playlists, users);
app.use('*', other);
app.listen(port);
app.use(errorHandler);

console.log("Escuchando en el puerto %d...", port)

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
        case (err instanceof ResourceNotFoundException):
            res.status(err.status);
            res.json({
                status: err.status,
                errorCode: err.errorCode})

        case (err instanceof AlreadyExistsArtistException || err instanceof AlreadyExistsAlbumException):
            res.status(409);
            res.json({  
                status: 409,
                errorCode: "RESOURCE_ALREADY_EXISTS"
            });
        case (err instanceof BadRequestException):
            res.status(err.status);
            res.json({
                status: err.status,
                errorCode: err.errorCode})
        case (err instanceof InvalidInputError):
            res.status(err.status);
            res.json({
                status: err.status, 
                errorCode: err.errorCode}); 

        case (err !== undefined && err.type === 'entity.parse.failed'):
            // body-parser error para JSON invalido
            res.status(err.status);
            res.json({
                status: err.status, 
                errorCode: 'INVALID_JSON'});

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

