const bodyParser= require('body-parser');
const express   = require('express');        // import express
const router    = express.Router();
const app       = express();
const rp        = require('request-promise');
const BASE_URL  = 'http://localhost:8081/api';

//ENDPOINT POST /api/subscribe
router.route('/subscribe')
.post((req, res) => {
    const data = req.body;
    if (data.artistId === undefined || data.email === undefined){
        next(new LackOfArgumentsException());
    }
    const options = {
        uri: BASE_URL + '/artists/' + data.artistId,
        json: true
    };
    let tmpArtist = rp.get(options)
        .then(response => {
            const options2 = {
                uri: BASE_URL + '/artists/notification/subscribe',
                qs: {
                    artistId: data.artistId,
                    email: data.email
                },
                json: true
            };
            rp.post(options2)
        }).then(response => {
            res.status(201);
            res.send({
                success: true
            })
        }).catch(exception => {
            throw new ArtistNotFoundException();
        })  
})
//ENDPOINT POST /api/unsubscribe
router.route('/unsubscribe')
.post((req, res) => {
    const data = req.body;
    if (data.artistId === undefined || data.email === undefined){
        next(new LackOfArgumentsException());
    }
    const options = {
        uri: this._BASE_URL + 'artists/:artistId',
        json: true
    };
    let tmpArtist = rp.get(options);

    if (tmpArtist === undefined) {
        next(new ArtistNotFoundException());
    }
    const options2 = {
        uri: this._BASE_URL + '/artists/<artistID>/subscribe',
        json: true
    }
    rp.post(options)

    try {
        
    }catch(err){

    }
})
// ENDPOINT POST /api/notify
router.route('/notify')
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
    console.log("Se guarda Unqfy desde /artists/ POST");
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(201);
    res.json(
        tmpArtist.toJSON()
    );
})
//ENDPOINT GET /api/subscriptions?artistId=<artistID></artistID>
router.route('/subscriptions?artistId=<artistID></artistID>')
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
//ENDPOINT DELETE /api/subscriptions
router.route('/subscriptions')
.delete((req, res) => {
    const artistId = parseInt(req.params.artistId);
    try{
        unqfy.removeArtist(artistId);
    }catch(err){
        errorHandler(err, req, res);
        return;
    }
    console.log("Se guarda Unqfy desde /artists/<artistID> DELETE");
    saveUNQfy(unqfy);
    unqfy = getUNQfy();
    res.status(204);
    res.send({
        success: true
    })
})

const port = 8082;  // set our port

app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            err = new BadRequestException();
            errorHandler(err, req, res);
            return;
        }
        next();
    });
});
app.use('/api', router);
app.use(errorHandler);
const server = app.listen(port, () => {
    console.log("Server running");
});

function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof InvalidInputError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
      // body-parser error para JSON invalido
      res.status(err.status);
      res.json({status: err.status, errorCode: 'INVALID_JSON'});
    } else {
      // continua con el manejador de errores por defecto
      next(err);
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
 
 class InvalidInputError extends APIError {
    constructor() {
      super('InvalidInputError', 400, 'INVALID_INPUT_DATA');
    }  
 }

 class LackOfArgumentsException extends APIError{
    constructor(){
        super('LackOfArgumentsException', 400, 'LACK_OF_ARGUMENTS_EXCEPTION');
    }
 }

 class ArtistNotFoundException extends APIError{
    constructor(){
        super('ArtistNotFoundException', 400, 'ARTIST_NOT_FOUND_EXCEPTION');
    }
 }