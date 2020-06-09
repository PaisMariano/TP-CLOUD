let express     = require('express');        // import express
let app         = express();                 // define our app using express
let router      = express.Router();
let bodyParser  = require('body-parser');
let unqmod      = require('./unqfy.js');
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
router.route('/artists/:artistId')
.get((req, res) => {
    const artistId = parseInt(req.params.artistId);
    let tmpArtist;
    let tmpAlbums;
    try {
        tmpArtist = unqfy.getArtistById(artistId);
        tmpAlbums = unqfy.getAlbumsForArtist(artistId);
    }catch(err){
        errorHandler(err, req, res);
    }
    res.status("200");
    res.json({
        message : 'Se encontró el artista.',
        body : {
            "id":       tmpArtist._id,
            "name":     tmpArtist._name,
            "country":  tmpArtist._country,
            "albums":   tmpAlbums
        }
    });
})
.patch((req, res) => {
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
    }catch{
        errorHandler(err, req, res);
    }    
    
    res.status("200");
    res.json({  
        message : 'Se actualizó el artista correctamente.', 
        body : {
            "id":       tmpArtist._id,
            "name":     tmpArtist._name,
            "country":  tmpArtist._country,
            "albums":   tmpArtist._albums.map(album => album.toJSON())
        }
    });
})
.delete((req, res) => {
    const artistId = parseInt(req.params.artistId);
    try{
        unqfy.removeArtist(artistId);
    }catch{
        errorHandler(err, req, res);
    }
    
    res.status("204");
    res.send({
        success: true
    })
})

//ENDPOINT /artists/
router.route('/artists')
.get((req, res) => {
    let name = req.query.name;
    let tmpArtists;
    //Valido si me pasaron el campo name.
    if (name === undefined){
        name = ""
    }
    try{
        tmpArtists = unqfy.getPartialMatchingArtists(name);
    }catch{
        errorHandler(err, req, res);
    }

    res.status("200");
    res.json({  
        message : 'Artista/s encontrado/s.', 
        body : {
            "artists" : tmpArtists.map(artist => artist.toJSON())
        }
    });  
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
    }catch(err){
        errorHandler(err, req, res);
    }

    res.status("201");
    res.json({  
        message : 'Se creó el artista correctamente.', 
        body : {
            "id":       tmpArtist._id ,
            "name":     tmpArtist._name,
            "country":  tmpArtist._country,
            "albums":   tmpArtist._albums.map(album => album.toJSON())
        }
    });
})

//ENDPOINT /albums/<albumId>
router.route('/albums/:albumId')
.get((req, res) => {
    const albumId = parseInt(req.params.albumId);
    let tmpAlbum;
    try {  
        tmpAlbum = unqfy.getAlbumById(albumId);
    }catch(err){
        errorHandler(err, req, res);
    }
    res.status("200");
    res.json({  
        message : 'Se encontró el album.', 
        body : {
            "id":       tmpAlbum._id,
            "name":     tmpAlbum._name,
            "year":     tmpAlbum._year,
            "tracks":   tmpAlbum._tracks.map(track => track.toJSON())
        }
    });
})
.patch((req, res) => {
    const data = req.body;
    const albumId = parseInt(req.params.artistId);
    if (data.year === undefined){
        let err = new BadRequestException();
        errorHandler(err, req, res);
    }
    try{
        data = {
            name: unqfy.getAlbumById(albumId).name,
            ...data
        }
        unqfy.updateAlbum(albumId, data);
    }catch{
        errorHandler(err, req, res);
    }

    let tmpAlbum = unqfy.getAlbumById(albumId);
    
    res.status("200");
    res.json({
        message : 'Se actualizó el álbum correctamente.',
        body : {
            "id":       tmpAlbum._id,
            "name":     tmpAlbum._name,
            "year":     tmpAlbum._year,
            "tracks":   tmpAlbum._tracks.map(track => track.toJSON())
        }
    });
})
.delete((req, res) => {
    const albumId = parseInt(req.params.albumId);
    try{
        unqfy.removeAlbum(albumId);
    }catch{
        errorHandler(err, req, res);
    }
    
    res.status("204");
    res.send({
        success: true
    })
})

//ENDPOINT /albums/
router.route('/albums')
.get((req, res) => {
    let name = req.query.name;
    let tmpAlbums;
    //Valido si me pasaron el campo name.
    if (name === undefined){
        name = "";
    }
    try{
        tmpAlbums = unqfy.getPartialMatchingAlbums(name);
    }catch{
        errorHandler(err, req, res);
    }

    res.status("200");
    res.json({  
        message : 'Álbum/s encontrado/s.', 
        body : {
            "albums" : tmpAlbums.map(album => album.toJSON())
        }
    });  
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
        let err2 = new ResourceNotFoundException();
        errorHandler(err2, req, res);
    }

    res.status("201");
    res.json({  
        message : 'Se creó el álbum correctamente.', 
        body : {
            "id":       tmpAlbum._id ,
            "name":     tmpAlbum._name,
            "year":     tmpAlbum._year,
            "tracks":   tmpAlbum._tracks.map(track => track.toJSON())
        }
    });
})

router.route('/tracks/:trackId/lyrics')
.get((req, res) => {
    const trackId = parseInt(req.params.trackId);
    let tmpTrack;
    try {        
        unqfy.getLyrics(trackId);
        tmpTrack = unqfy.getTrackById(trackId);
    }catch(err){
        errorHandler(err, req, res);
    }
    res.status("200");
    res.json({  
        message : 'Se encontró el track.', 
        body : {
            /*"id":       tmpTrack._id,*/
            "name":     tmpTrack._name,
            "lyrics":   tmpTrack._lyrics,
        }
    });
})

//ENDPOINT /playlists/<playlistId>
router.route('/playlists/:playlistId')
.get((req, res) => {
//     const albumId = parseInt(req.params.albumId);
//     let tmpAlbum;
//     try {  
//         tmpAlbum = unqfy.getAlbumById(albumId);
//     }catch(err){
//         errorHandler(err, req, res);
//     }
//     res.status("200");
//     res.json({  
//         message : 'Se encontró el album.', 
//         body : {
//             "id":       tmpAlbum._id,
//             "name":     tmpAlbum._name,
//             "year":     tmpAlbum._year,
//             "tracks":   tmpAlbum._tracks.map(track => track.toJSON())
//         }
//     });
})
.delete((req, res) => {
    // const albumId = parseInt(req.params.albumId);
    // try{
    //     unqfy.removeAlbum(albumId);
    // }catch{
    //     errorHandler(err, req, res);
    // }
    
    // res.status("204");
    // res.send({
    //     success: true
    // })
})

//ENDPOINT /api/playlists
router.route('/playlists')
.get((req, res) => {
//     let name = req.query.name;
//     let tmpAlbums;
//     //Valido si me pasaron el campo name.
//     if (name === undefined){
//         name = "";
//     }
//     try{
//         tmpAlbums = unqfy.getPartialMatchingAlbums(name);
//     }catch{
//         errorHandler(err, req, res);
//     }

//     res.status("200");
//     res.json({  
//         message : 'Álbum/s encontrado/s.', 
//         body : {
//             "albums" : tmpAlbums.map(album => album.toJSON())
//         }
//     });  
})
.post((req, res) => {
    // const data = req.body;
    // let tmpAlbum;
    // if (data.artistId === undefined || data.name === undefined || data.year === undefined){
    //     let err = new BadRequestException();
    //     errorHandler(err, req, res);
    // }
    // try {
    //     tmpAlbum = unqfy.addAlbum(data.artistId, data);
    // }catch(err){
    //     let err2 = new ResourceNotFoundException();
    //     errorHandler(err2, req, res);
    // }

    // res.status("201");
    // res.json({  
    //     message : 'Se creó el álbum correctamente.', 
    //     body : {
    //         "id":       tmpAlbum._id ,
    //         "name":     tmpAlbum._name,
    //         "year":     tmpAlbum._year,
    //         "tracks":   tmpAlbum._tracks.map(track => track.toJSON())
    //     }
    // });
})





//Estos deberian quedar abajo de todo.

router.route('*')
.get((req, res) => {
    let err;
    errorHandler(err, req, res);
})
.post((req, res) => {
    let err;
    errorHandler(err, req, res);
})
.delete((req, res) => {
    let err;
    errorHandler(err, req, res);
})
.patch((req, res) => {
    let err;
    errorHandler(err, req, res);
})

app.use(bodyParser.json());
app.use('/api', router);
app.listen(port);
app.use(errorHandler);

console.log("Escuchando en el puerto %d...", port)

function errorHandler(err, req, res) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    switch(true){
        case (err instanceof NoMatchingArtistException || err instanceof NoMatchingAlbumException):
            res.status("404");
            res.json({
                status: "404",
                errorCode: "RESOURCE_NOT_FOUND"
            });
        case (err instanceof ResourceNotFoundException):
            res.status(err.status);
            res.json({
                status: err.status,
                errorCode: err.errorCode})

        case (err instanceof AlreadyExistsArtistException || err instanceof AlreadyExistsAlbumException):
            res.status("409");
            res.json({  
                status: "409",
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
            res.status("404");
            res.json({  
                status: "404",
                errorCode: "RESOURCE_NOT_FOUND"
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
 
