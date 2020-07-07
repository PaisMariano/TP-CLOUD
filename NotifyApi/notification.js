const bodyParser= require('body-parser');
const express   = require('express');        // import express
const router    = express.Router();
const app       = express();
const rp        = require('request-promise');
const BASE_URL  = 'http://localhost:8081/api';
const sendMail  = require('./sendMail.js');

//ENDPOINT POST /api/subscribe
router.route('/subscribe')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.email === undefined){
        next(new LackOfArgumentsException());
        return;
    }
    const options = {
        uri: BASE_URL + '/artists/' + data.artistId,
        json: true
    };
    rp.get(options)
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
            res.status(200);
            res.send({
                success: true
            })
        }).catch(exception => {
            if (exception.error.errorCode === "RESOURCE_NOT_FOUND"){
                next(new ArtistNotFoundException());
            }
        })  
})
//ENDPOINT POST /api/unsubscribe
router.route('/unsubscribe')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.email === undefined){
        next(new LackOfArgumentsException());
        return;
    }
    const options = {
        uri: BASE_URL + '/artists/' + data.artistId,
        json: true
    };
    rp.get(options)
        .then(response => {
            const options2 = {
                uri: BASE_URL + '/artists/notification/unsubscribe',
                qs: {
                    artistId: data.artistId,
                    email: data.email
                },
                json: true
            };
            rp.delete(options2);
        }).then(response => {
            res.status(200);
            res.send({
                success: true
            })
        }).catch(exception => {
            if (exception.error.errorCode === "RESOURCE_NOT_FOUND"){
                next(new ArtistNotFoundException());
            }
        })  
})
// ENDPOINT POST /api/notify
router.route('/notify')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.subject === undefined || data.message === undefined){
        next(new LackOfArgumentsException());
        return;
    }
    const options = {
        uri: BASE_URL + '/artists/' + data.artistId,
        json: true
    };
    return rp.get(options)
        .then(response => {
            const options2 = {
                uri: BASE_URL + '/artists/notification/subscribers',
                qs: {
                    artistId: data.artistId
                },
                json: true
            };
            return rp.get(options2)
        }).then(response => {
            response.emails.forEach(email => {
                sendMail.sendMessage(email, data.subject, data.message);});
            res.status(200);
            res.send({
                success: true
            })          
        }).catch(exception => {
            if (exception.error.errorCode === "RESOURCE_NOT_FOUND"){
                next(new ArtistNotFoundException());
            }else {
                next(new NotificationFailureException());
            }
        })  
})
///
///
/// FALTA DE ACA PARA ABAJO
///
///
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
router.route('*')
.get((req, res, next) => {
    next(new NoRouteException());
})
.post((req, res, next) => {
    next(new NoRouteException());
})
.delete((req, res, next) => {
    next(new NoRouteException());
})
.patch((req, res, next) => {
    next(new NoRouteException());
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

    if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'INVALID_JSON'});
    }else if (
        err instanceof InvalidInputError || 
        err instanceof NoRouteException ||
        err instanceof ArtistNotFoundException ||
        err instanceof LackOfArgumentsException || 
        err instanceof BadRequestException ||
        err instanceof NotificationFailureException){
            res.status(err.status);
            res.json({status:err.status, errorCode: err.errorCode});
    } else {
        res.status(500);
        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
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
        super('LackOfArgumentsException', 400, 'BAD_REQUEST');
    }
}

class ArtistNotFoundException extends APIError{
   constructor(){
        super('ArtistNotFoundException', 404, 'RELATED_RESOURCE_NOT_FOUND');
    }
}

class BadRequestException extends APIError{
    constructor(){
        super('BadRequestException', 400, 'BAD_REQUEST');
    }
}

class NotificationFailureException extends APIError{
    constructor(){
        super('NotificationFailureException', 500, 'INTERNAL_SERVER_ERROR');
    }
}

class NoRouteException extends APIError{
    constructor(){
        super('NoRouteException', 404, 'RESOURCE_NOT_FOUND')
    }
}