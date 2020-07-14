const monitor = require('../monitor');
const express = require('express');
const monitor  = express.Router();
const other   = express.Router();

//ENDPOINT /monitor/
monitor.route('/monitor/')
.get((req, res) => {
    const servicesJson = monitor.checkServicesStatus().map(service => service.toJSON());
    res.status(200);
    res.json(
        {
            services: servicesJson
        }
    );
})
.put((req, res) => {
    const data = req.body;
    if (data.hasOwnProperty('setStatus')) {
        switch (data.setStatus) {
            case "on":
                monitor.turnOn();
                break;
            case "off":
                monitor.turnOff();
                break;
            default:
                const err = new InvalidInputError();
                errorHandler(err, req, res);
                break;
        }
    } else {
        const err = new BadRequestException();
        errorHandler(err, req, res);
    }
    res.status(200);
    res.json({currentStatus: (monitor.isOnline ? "online" : "offline")});
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
        case (err instanceof NoRouteException):
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
    monitor,
    other,
    errorHandler,
    BadRequestException
};