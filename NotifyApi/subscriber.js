const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy

class Subscriber {
    constructor(artistId, anEmail){
        this._artistId  = artistId;
        this._email     = anEmail;
    }
    get artistId(){
        return this._artistId;
    }
    get email(){
        return this._email;
    }
}

class Subscribers{
    constructor(){
        this._subscribers = [];
    }    
    get subscribers() {
        return this._subscribers;
      }
    subscribe(artistId, anEmail) {
        let subscriber = new Subscriber(artistId, anEmail);
        if (!this.includesObject(subscriber)){
            this._subscribers.push(subscriber);
        }
    }
    unSubscribe(artistId, anEmail){
        this._subscribers = this._subscribers.filter(subscriber => (
            !(subscriber.artistId === artistId && subscriber.email === anEmail)
        ))
    }
    deleteSubscribers(artistId){
        this._subscribers = this._subscribers.filter(subscriber => (
            subscriber.artistId !== artistId)
        );
    }
    includesObject(subs){
        return this._subscribers.filter(subscriber => {
            return (subscriber.artistId === subs.artistId && subscriber.email === subs.email);
        }).length > 0
    }
    save(filename) {
        console.log("Write starting..");
    
        const serializedData = picklify.picklify(this);
    
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2), { encoding: 'utf-8' });
        console.log("Write successful");
      }
    
      static load(filename) {
        const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
        const classes = [Subscriber, Subscribers];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
      }
}

module.exports = {
    Subscribers
  };