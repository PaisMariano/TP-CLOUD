class Log {
    constructor(level, message) {
        this._level = level;
        this._message = message;
        this._datetime = new Date();
    }

    get level() { return this._level };
    get message() { return this._message };
    get datetime() { return this._datetime };

    set level(newLevel) { return this._level = newLevel };
    set message(newMessage) { return this._message = newMessage };
};

module.exports = Log;