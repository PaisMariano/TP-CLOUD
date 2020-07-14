const Service = require('../service.js');
const axios = require('axios');

const localhostURL = 'http://localhost/';
const unqfyPort = '8081';
const notificationPort = '8082';
const loggingPort = '8083';

class Monitor {
    constructor() {
        this._isOnline = false;
        this._intervalId = null;
        // this._services = [new Service(localhostURL+unqfyPort, "UNQfy"), new Service(localhostURL+notificationPort, "Notification"), new Service(localhostURL+loggingPort), "Logging"];
        this._services = [new Service(localhostURL+unqfyPort, "UNQfy")];
    };

    get services() { return this._services; }
    get isOnline() { return this._isOnline; }

    checkServicesStatus() {
        this._services.map(service => {
            axios.get(service.url)
            .then(res => {
                if (!service.isOnline()) {
                    service.isOnline = true;
                    // mandar por slack que el service se levanto/normalizo
                    console.log(`Se NORMALIZO el servicio de ${service.name}`);
                }
            })
            .catch(err => {
                if (service.isOnline()) {
                    service.isOnline = false;
                    // mandar por slack que el service se cayo
                    console.log(`Se CAYO el servicio de ${service.name}`);
                }
            });
            return service;
        });
    };

    turnOn() {
        if (!this._isOnline) {
            this._intervalId = setInterval(this.checkServicesStatus, 5000);
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