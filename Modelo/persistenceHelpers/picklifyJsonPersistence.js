const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('../unqfy'); // importamos el modulo unqfy

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
  }
  
function saveUNQfy(unqfy, filename = 'data.json') {
    console.log("Se guarda con el metodo 'saveUNQfy'");
    unqfy.save(filename);
}

module.exports = {
    getUNQfy,
    saveUNQfy
}