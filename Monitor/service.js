class Service {
  constructor(serviceUrl, serviceName) {
    this._url = serviceUrl;
    this._name = serviceName;
    this._isOnline = false;
    this._isFreshInstance = true;
  }

  get url() {
    return this._url;
  }
  get name() {
    return this._name;
  }
  get isOnline() {
    return this._isOnline;
  }
  get isFreshInstance() {
    return this._isFreshInstance;
  }

  set url(newUrl) {
    return (this._url = newUrl);
  }
  set name(newName) {
    return (this._name = newName);
  }
  set isOnline(onlineStatus) {
    return (this._isOnline = onlineStatus);
  }
  set isFreshInstance(freshStatus) {
    return (this._isFreshInstance = freshStatus);
  } 

  toJSON() {
    return {
      name: this.name,
      isOnline: this.isOnline,
      url: this.url,
    };
  }
};

module.exports = Service;