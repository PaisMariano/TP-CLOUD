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
                if (service.isFreshInstance) {
                    service.isFreshInstance = false;
                    return;
                }
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
            })
            .catch(err => {
                const currentDatetime = new Date();
                const currentTime = formatTime(currentDatetime);
                if (err.response && err.response.status !== 500) {
                    wentOnlineHandler(service, currentTime);
                } else {
                    if (err.code === "ECONNREFUSED") {
                        if (service.isOnline) {
                            service.isOnline = false;
                            const wentDownMsg = `[${currentTime}] El servicio ${service.name} ha dejado de funcionar`;
                            console.log(wentDownMsg);
                            this.slackHelper.postMessage(wentDownMsg);
                        }
                    } else {
                        console.error(`Fallo de forma inesperada la api del servicio ${service.name}`);
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