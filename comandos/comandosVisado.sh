#!/bin/bash
cd ../Modelo;

#Creación de Artistas
node main.js addArtist "La Renga" "Argentina"
node main.js addArtist "Cafe Tacvba" "Mexico"
node main.js addArtist "Dua Lipa" "USA"
node main.js addArtist "Maluma" "Puerto Rico"
node main.js addArtist "Molotov" "Mexico"
node main.js addArtist "Cuarteto de Nos" "Uruguay"

#Creación de Albums
node main.js addAlbum "Despedazado por mil partes" 1 1995
node main.js addAlbum "La Renga" 1 1998
node main.js addAlbum "Re" 2 1994
node main.js addAlbum "Dua Lipa" 3 2018
node main.js addAlbum "F.A.M.E." 4 2018
node main.js addAlbum "A donde jugaran las niñas" 5 1997
node main.js addAlbum "Raro" 6 2006

#Creación de Tracks
node main.js addTrack "Desnudo para siempre" 1 248 Rock Heavy
node main.js addTrack "A la carga mi rock and roll" 1 336 Rock Heavy
node main.js addTrack "Cuando Vendran" 1 262 Rock Heavy
node main.js addTrack "Psilosibe Mexicana" 1 334 Rock Pop
node main.js addTrack "El final es en donde parti" 1 277 Rock

node main.js addTrack "El terco" 2 270 Rock Alternativo
node main.js addTrack "Tripa y corazon" 2 171 Rock Clasico
node main.js addTrack "Bien alto" 2 206 Rock
node main.js addTrack "El hombre de la estrella" 2 202 Rock
node main.js addTrack "El revelde" 2 224 Rock

node main.js addTrack "El aparato" 3 198 Pop Alternativo
node main.js addTrack "La ingrata" 3 212 Pop Jazz
node main.js addTrack "El ciclon" 3 255 Pop Alternativo
node main.js addTrack "El borrego" 3 188 Pop Alternativo
node main.js addTrack "Esa noche" 3 246 Pop Clasico

node main.js addTrack "Genesis" 4 266 Pop Alternativo
node main.js addTrack "Lost in your light" 4 264 Pop Chillout
node main.js addTrack "Hotter than hell" 4 248 Pop House
node main.js addTrack "Be the one" 4 203 Pop House
node main.js addTrack "IDGAF" 4 270 Pop

node main.js addTrack "Corazon" 5 123 Salsa Bachata
node main.js addTrack "El prestamo" 5 444 Salsa Romantico 
node main.js addTrack "Cuenta a saldo" 5 333 Romantico
node main.js addTrack "Hangover" 5 671 Bachata Lento
node main.js addTrack "Marinero" 5 246 Lento Romantico

node main.js addTrack "Voto latino" 6 243 Punk Rock
node main.js addTrack "Gimme the power" 6 136 Punk Rock
node main.js addTrack "Puto" 6 205 Punk Rock Alternativo
node main.js addTrack "Chinga tu madre" 6 255 Punk Rock Nacional
node main.js addTrack "Matate tete" 6 187 Punk Rock Heavy

node main.js addTrack "Nada es gratis en la vida" 7 180 Rock Tranqui
node main.js addTrack "Hoy estoy raro" 7 126 Rock Tranqui
node main.js addTrack "Asi soy yo" 7 333 Rock Tranqui
node main.js addTrack "Yendo a la casa de Damian" 7 320 Rock Tranqui 
node main.js addTrack "Inverno del 92" 7 420 Rock Tranqui

#Creación de User
node main.js addUser Mariano
node main.js addUser FedeCapo

#Creación de Playlist
node main.js generatePlaylist "Mi playlist favorita" 3000 Rock
node main.js generatePlaylist "Relaxing Music" 1400 Alternativo Tranqui
node main.js generatePlaylist "Mi lista pop" 2200 Pop Salsa

#Listen tracks
node main.js userListenTrack 1 5
node main.js userListenTrack 1 2
node main.js userListenTrack 1 2
node main.js userListenTrack 1 2
node main.js userListenTrack 1 2
node main.js userListenTrack 1 5
node main.js userListenTrack 1 5
node main.js userListenTrack 1 7
node main.js userListenTrack 1 7
node main.js userListenTrack 1 7
node main.js userListenTrack 1 10
node main.js userListenTrack 1 13
node main.js userListenTrack 1 13
node main.js userListenTrack 1 13
node main.js userListenTrack 1 10
node main.js userListenTrack 1 3

node main.js userListenTrack 2 1
node main.js userListenTrack 2 1
node main.js userListenTrack 2 1
node main.js userListenTrack 2 2
node main.js userListenTrack 2 2
node main.js userListenTrack 2 2
node main.js userListenTrack 2 5
node main.js userListenTrack 2 5
node main.js userListenTrack 2 3
node main.js userListenTrack 2 3
node main.js userListenTrack 2 11