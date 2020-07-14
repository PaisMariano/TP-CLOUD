class Service {
  constructor(serviceUrln, serviceName) {
    this._url = serviceUrl;
    this._name = serviceName;
    this._isOnline = false;
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

  set url(newUrl) {
    return (this._url = newUrl);
  }
  set name(newName) {
    return (this._name = newName);
  }
  set isOnline(onlineStatus) {
    return (this._isOnline = onlineStatus);
  }

  toJSON() {
    return {
      name: this.name,
      status: this.isOnline,
      url: this.url,
    };
  }
};

module.exports = Service;