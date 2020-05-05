# 1er Visado Taller de Desarrollo Web/Cloud
**UML UNQFY**

![alt text](https://github.com/PaisMariano/TP-CLOUD/blob/DEV/UML/Visado1%20UML%20UNQFY.png)
------

**Links a tipos de comandos**

- [Creadores](#creadores)
- [Eliminadores](#eliminadores)
- [Getters](#getters)
- [Buscadores](#buscadores)
- [Varios](#varios)

------

### Integrantes del grupo

|  Nombre  | Apellido  |
| :------: | :-------: |
| Mariano  |   Pais    |
| Federico | Cameriere |

------

### Documentación de uso

Se interactúa con el programa desde la línea de comandos (CLI), para esto se debe contar con [`nodejs`](https://nodejs.org/) instalado y ejecutar `npm install` en una terminal desde la carpeta *visado_1*.

**Aclaración: Todos los comandos se deben correr desde la carpeta *visado_1***

A continuación se listan los comandos que acepta y cómo usarlos:

#### Creadores

1. **Agregar artista** 

  ```bash
  node main.js addArtist <name> <country>
  ```

  Reemplazar `name` por el nombre del artista y `country` por el país del mismo.

2. **Agregar album**

  ```bash
  node main.js addAlbum <name> <artistId> <year>
  ```

  Reemplazar `name` por el nombre del album, `artistId` por el id del artista autor del mismo, `year` por su año de lanzamiento.

3. **Agregar track**

  ```bash
  node main.js addTrack <name> <albumId> <duration> <genre1> <genre2> .. <genreN>
  ```

  Reemplazar `name` por el nombre del track, `albumId` por el id de su album, `duration` por la duración del mismo, y el resto de los argumentos van a ser leidos como géneros (`genre1`, `genre2`, etc).

4. **Agregar usuario**

  ```bash
  node main.js addUser <name>
  ```

  Reemplazar `name` por el nombre del usuario.

------

#### Eliminadores

- **Eliminar artista**

  ```bash
  node main.js deleteArtist <artistId>
  ```

  Reemplazar `artistId` por el id del artista.

- **Elminar album**

  ```bash
  node main.js deleteAlbum <albumId>
  ```

  Reemplazar `albumId` el id del album.

- **Eliminar track**

  ```bash
  node main.js deleteTrack <trackId>
  ```

  Reemplazar `trackId` por el id del track.

- **Eliminar playlist**

  ```bash
  node main.js deletePlaylist <playlistId>
  ```

  Reemplazar `playlistId` por el id del playlist.

------

#### Getters

- **Obtener todos los artistas**

  ```bash
  node main.js getArtists
  ```

- **Obtener todos los albumes de un artista**

  ```bash
  node main.js getAlbums <artistId>
  ```

  Reemplazar `artistId` por el id del artista autor de los albumes.

- **Obtener todos los tracks de un album**

  ```bash
  node main.js getTracks <albumId>
  ```

  Reemplazar `albumId` por el id del album de los tracks.

- **Obtener todos los playlists**

  ```bash
  node main.js getPlaylists
  ```

- **Obetener todos los users**

  ```bash
  node main.js getUsers
  ```

- **Obtener artista**

  ```bash
  node main.js getArtist <artistId>
  ```

  Reemplazar `artistId` por el id del artista.

- **Obtener album**

  ```bash
  node main.js getAlbum <albumId>
  ```

  Reemplazar `albumId` por el id del album.

- **Obtener track**

  ```bash
  node main.js getTrack <trackId>
  ```

  Reemplazar `trackId` por el id del track.

- **Obtener playlist**

  ```bash
  node main.js getPlaylist <playlistId>
  ```

  Reemplazar `playlistId` por el id de la playlist.

- **Obtener user**

  ```bash
  node main.js getUser <userId>
  ```

  Reemplazar `userId` por el id del user.

------

#### Buscadores

- **Buscar tracks de un artista**

  ```bash
  node main.js getTracksByArtist <artistId>
  ```

  Reemplazar `artistsId` por el id del artista.

- **Buscar tracks por géneros**

  ```bash
  node main.js getTracksByGenres <genre1> <genre2> .. <genreN>
  ```

  Reemplazar `genre1`, `genre2` y todos los siguientes argumentos por los géneros.

- **Buscar todas las entidades por nombre parcial (artistas, albumes, tracks y playlists)**

  ```bash
  node main.js searchAllPartialName <stringToSearch>
  ```

  Reemplazar `stringToSearch` por el nombre parcial a buscar.

- **Buscar tracks por nombre parcial**

  ```bash
  node main.js searchTracksPartialName <stringToSearch>
  ```

  Reemplazar `stringToSearch` por el nombre parcial a buscar.

- **Buscar albumes por nombre parcial**

  ```bash
  node main.js searchAlbumsPartialName <stringToSearch>
  ```

  Reemplazar `stringToSearch` por el nombre parcial a buscar.

- **Buscar artistas por nombre parcial**

  ```bash
  node main.js searchArtistsPartialName <stringToSearch>
  ```

  Reemplazar `stringToSearch` por el nombre parcial a buscar.

- **Buscar playlists por nombre parcial**

  ```bash
  node main.js searchPlaylistsPartialName <stringToSearch>
  ```

  Reemplazar `stringToSearch` por el nombre parcial a buscar.

- **Buscar los tracks escuchados por un usuario**

  ```bash
  node main.js getListenedTracksByUser <userId>
  ```

  Reemplazar `userId` por el id del usuario.

------

#### Varios

- **Cantidad de veces que un user escuchó un track particular**

  ```bash
  node main.js timesListenedTrackByUser <userId> <trackId>
  ```

  Reemplazar `userId` por el id del user, y `trackId` por el id del track.

- **Top 3 tracks más escuchados de un artista**

  ```bash
  node main.js top3TracksFromArtist <artistId>
  ```

  Reemplazar `artistId` por el id del artista.

- **Generar un playlist con duración máxima y de ciertos géneros**

  ```bash
  node main.js generatePlaylist <name> <maxDuration> <genre1> <genre2> .. <genreN>
  ```

  Reemplazar `name` por el nombre del playlist, `maxDuration` por la duración máxima de la misma, y `genre1`, `genre2`, etc y todos los siguientes argumentos por los géneros posibles para sus tracks.

- **Un usuario escucha un track**

  ```bash
  node main.js userListenTrack <userId> <trackId>
  ```

  Reemplazar `userId` por el id del usuario, y `trackId` por el id del track.
