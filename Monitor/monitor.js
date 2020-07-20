const Service = require('./service');
const SlackHelper = require('./external api helpers/slackHelper');
const axios = require('axios');

const localhostURL = 'http://localhost';
const unqfyPort = '8081';
const notificationPort = '8082';
const loggingPort = '8083';

class Monitor {
    constructor() {
        this._isOnline = false;
        this._intervalId = null;
        this._services = [
            new Service(`${localhostURL}:${unqfyPort}/api`, "UNQfy"),
            new Service(`${localhostURL}:${notificationPort}/api`, "Notification"),
            new Service(`${localhostURL}:${loggingPort}/api`, "Logging")
        ];
        this._slackHelper = new SlackHelper();
        this.turnOn();
    };

    get isOnline() { return this._isOnline; }
    get services() { return this._services; }
    get slackHelper() { return this._slackHelper; }

    checkServicesStatus() {
        const wentOnlineHandler = (service, currentTime) => {
            if (!service.isOnline) {
                service.isOnline = true;
                // if (service.isFreshInstance) {
                //     service.isFreshInstance = false;
                //     return;
                // }
                const wentUpMsg = `[${currentTime}] El servicio ${service.name} ha vuelto a la normalidad`;
                console.log(wentUpMsg);
                this.slackHelper.postMessage(wentUpMsg);
            }
        };

        const formatTime = date => `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;

        return this._services.map(service => {
            axios.get(service.url)
            .then(res => {
                const currentDatetime = new Date();
                const currentTime = formatTime(currentDatetime);
                wentOnlineHandler(service, currentTime);
                console.log("respuesta ok: ", res);
            })
            .catch(err => {
                const currentDatetime = new Date();
                const currentTime = formatTime(currentDatetime);
                if (err.response && err.response.status !== 500) {
                    wentOnlineHandler(service, currentTime);
                } else {
                    if (service.isOnline) {
                        service.isOnline = false;
                        const wentDownMsg = `[${currentTime}] El servicio ${service.name} ha dejado de funcionar`;
                        console.log(wentDownMsg);
                        this.slackHelper.postMessage(wentDownMsg);
                    }
                    if (err.code == "ECONNREFUSED" || err.code == "EHOSTUNREACH" || err.code == "ETIMEDOUT") {
                        console.log("Error message: ", err.message);
                    } else {
                        if (err.request) {
                            console.log("error request: ", err.request);
                        } else {
                            console.error("error message: ", err.message);
                        }
                        console.error(`Fallo de forma inesperada la api del servicio ${service.name}`);
                        console.error("error: ", err);
                        console.log("error.response: ", err.response);
                        console.log("error.response.data: ", err.response.data);
                        console.log("error.response.status: ", err.response.status);
                        console.log("error.response.headers: ", err.response.headers);
                        console.log("error.toJSON(): ", err.toJSON());
                    }
                }
            });
            return service;
        });
    };

    turnOn() {
        if (!this._isOnline) {
            this._intervalId = setInterval(this.checkServicesStatus.bind(this), 10000);
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