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

module.exports = {
    ArtistNotFoundException,
    BadRequestException,
    InvalidInputError,
    LackOfArgumentsException,
    NoRouteException,
    NotificationFailureException
  };