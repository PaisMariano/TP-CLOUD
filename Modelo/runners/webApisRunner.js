const bodyParser  = require('body-parser');
const express     = require('express');        // import express
const app         = express();                 // define our app using express
const {
    artists,
    albums,
    tracks,
    playlists,
    users,
    other,
    errorHandler,
    BadRequestException,
} = require('../apis/apiMethods');

const port = 8081;  // set our port

app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            err = new BadRequestException();
            errorHandler(err, req, res);
            return;
        }
        next();
    });
});
app.use('/api', artists, albums, tracks, playlists, users);
app.use('*', other);
app.use(errorHandler);
const server = app.listen(port, () => {
    console.log("Server running");
});

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", function () {
    //graceful shutdown
    console.log("Matando el proceso y apagando el server");
    server.close(() => {
        console.log("Server apagado");
        process.exit();
    });
});

console.log("Escuchando en el puerto %d...", port);