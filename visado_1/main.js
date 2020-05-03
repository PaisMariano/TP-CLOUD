

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
const CommandHandler = require('./commandHandler');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

function main() {

  const commandHandler = new CommandHandler(process.argv.slice(2));
  const unqfy = getUNQfy();
  commandHandler.executeCommand(unqfy);
  saveUNQfy(unqfy);


  // let dataArtist = {name : "La Renga", country: "Argentina"};
  // let dataAlbum = {name: "Despedazado por mil partes", year: "1995"};
  // let dataTrack1 = {name: "Cuando Vendran", genres: ["Rock"], duration: "4:22"};
  // let dataTrack2 = {name: "Psilosibe Mexicana", genres:["Rock"], duration: "5:34"};
  // let dataUser = {name: "Mariano"};
  // let dataPlaylist = {name: "lista1", tracks: []};
  // let unqfy = new unqmod.UNQfy();
  // unqfy.addArtist(dataArtist);
  // unqfy.addAlbum(1, dataAlbum);
  // unqfy.addTrack(1, dataTrack1);
  // unqfy.addTrack(1, dataTrack2);
  // unqfy.addUser(dataUser);
  // unqfy.addPlaylist(dataPlaylist);
  // unqfy.users[0].listenedTracks.push(unqfy.getTrackById(1));
  // unqfy.users[0].listenedTracks.push(unqfy.getTrackById(2));
  // unqfy.playlists[0].tracks.push(unqfy.getTrackById(1));
  // unqfy.playlists[0].tracks.push(unqfy.getTrackById(2));
  // console.log(unqfy.playlists[0]);
  // console.log("-------------------------------------------");
  // unqfy.removeTrack(1);
  // //console.log(unqfy.getArtistById(1));
  // console.log("-------------------------------------------");
  // //console.log(unqfy.getTrackById(1));
  // console.log("-------------------------------------------");
  // //console.log('arguments: ');
  // //process.argv.forEach(argument => console.log(argument)); 
  
}

main();
