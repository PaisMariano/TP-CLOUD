const bodyParser    = require('body-parser');
const express       = require('express');        // import express
const router        = express.Router();
const app           = express();
const { getNotify, saveNotify } = require('./persistenceHelper.js');
const rp            = require('request-promise');
const sendMail      = require('./sendMail.js');
const unqHelper     = require('./unqfyHelper.js');
const unqfyHelper   = new unqHelper.UnqfyHelper();
let subscribers     = getNotify();
const { InvalidInputError, LackOfArgumentsException, ArtistNotFoundException, BadRequestException,
    NotificationFailureException, NoRouteException } = require('./exception.js');
console.log(subscribers);

//ENDPOINT POST /api/subscribe
router.route('/subscribe')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.email === undefined){
        next(new LackOfArgumentsException());
        return;
    }
    unqfyHelper.existArtist(data.artistId)
    .then(result => {
        subscribers.subscribe(data.artistId, data.email);
        saveNotify(subscribers);
        subscribers = getNotify();
        res.status(200);
        res.send({
            Body: ""
        })
    })
    .catch(err => (
        next(new ArtistNotFoundException()))
    );
})
//ENDPOINT POST /api/unsubscribe
router.route('/unsubscribe')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.email === undefined){
        next(new LackOfArgumentsException());
        return;
    }
    unqfyHelper.existArtist(data.artistId)
    .then(result => {
        subscribers.unSubscribe(data.artistId, data.email);
        saveNotify(subscribers);
        subscribers = getNotify();
        res.status(200);
        res.send({
            Body: ""
        })
    })
    .catch(err => (
        next(new ArtistNotFoundException()))
    );   
})
// ENDPOINT POST /api/notify
router.route('/notify')
.post((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined || data.subject === undefined || data.message === undefined){
        next(new LackOfArgumentsException());
        return;
    }
    unqfyHelper.existArtist(data.artistId)
    .then(result => {
        let emails = subscribers.subscribers.map(subs => { 
            if (subs.artistId === data.artistId) {
                return subs.email;
            }
        })
        try {        
            emails.forEach(email => {
                sendMail.sendMessage(email, data.subject, data.message);});
            res.status(200);
            res.send({
                Body: ""
            })
        } catch(err){
            next(new NotificationFailureException());
        }
    })
    .catch(err => (
        next(new ArtistNotFoundException()))
    );
})
//ENDPOINT GET /api/subscriptions?artistId=<artistID>
router.route('/subscriptions')
.get((req, res, next) => {
    let id = parseInt(req.query.artistId);
    //Valido si me pasaron el campo name.
    if (id === undefined){
        next(new LackOfArgumentsException());
    }
    unqfyHelper.existArtist(id)
    .then(result => {
        let emails = subscribers.subscribers.map(subs => { 
            if (subs.artistId === id) {
                return subs.email;
            }
        })
        res.status(200);
        res.send({
            Body: {"artistId": id,"subscriptors": emails}  
        })
    })
    .catch(err => (
        next(new ArtistNotFoundException()))
    );  
})
//ENDPOINT DELETE /api/subscriptions
router.route('/subscriptions')
.delete((req, res, next) => {
    const data = req.body;
    if (data.artistId === undefined){
        next(new LackOfArgumentsException());
        return;
    }    
    
    subscribers.deleteSubscribers(data.artistId);
    saveNotify(subscribers);
    subscribers = getNotify();
    res.status(200);
    res.send({
        Body: ""
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
 
