const Service = require('./service.js');
const axios = require('axios');

const localhostURL = 'http://localhost';
const unqfyPort = '8081';
const notificationPort = '8082';
const loggingPort = '8083';

class Monitor {
    constructor() {
        this._isOnline = false;
        this._intervalId = null;
        // this._services = [new Service(localhostURL+unqfyPort, "UNQfy"), new Service(localhostURL+notificationPort, "Notification"), new Service(localhostURL+loggingPort), "Logging"];
        this._services = [new Service(`${localhostURL}:${unqfyPort}`, "UNQfy")];
    };

    get services() { return this._services; }
    get isOnline() { return this._isOnline; }

    checkServicesStatus() {
        return this._services.map(service => {
            axios.get(service.url)
            .then(res => {
                // console.log("Servicio online");
                // console.log("rta: ", res);
                if (!service.isOnline) {
                    service.isOnline = true;
                    // mandar por slack que el service se levanto/normalizo
                    console.log(`Se NORMALIZO el servicio de ${service.name}`);
                }
            })
            .catch(err => {
                // console.log("Servicio offline");
                // console.error("error: ", err);
                // console.error("error response status: ", err.response.status);
                if (err.response && err.response.status !== 500) {
                    if (!service.isOnline) {
                        service.isOnline = true;
                        if (service.isFreshInstance) {
                            service.isFreshInstance = false;
                            return;
                        }
                        // mandar por slack que el service se levanto/normalizo
                        console.log(`Se NORMALIZO el servicio de ${service.name}`);
                    }
                } else {
                    if (err.code === "ECONNREFUSED") {
                        if (service.isOnline) {
                            console.log(`Se CAYO el servicio de ${service.name}`);
                            service.isOnline = false;
                            // mandar por slack que el service se cayo
                        }
                    } else {
                        console.error(`Fallo de forma inesperada la api del servicio de ${service.name}`);
                    }
                }
            });
            return service;
        });
    };

    turnOn() {
        if (!this._isOnline) {
            this._intervalId = setInterval(this.checkServicesStatus.bind(this), 5000);
            this._isOnline = true;
        }
    };
    
    turnOff() {
        if (this._isOnline) {
            clearInterval(this._intervalId);
            this._intervalId = null;
            this._isOnline = false;
        }
    };

    addService(service) {
        this._services.push(service);
    };
};

module.exports = new Monitor();