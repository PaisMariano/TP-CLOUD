class UserHandler{
    
  listen(unqfy, userId, trackId){
    const tempUser  = unqfy.getUserById(userId);
    const tempTrack = unqfy.getTrackById(trackId);
    tempUser.listen(tempTrack);
  }

  listenedTracks(unqfy, userId){
    const tempUser = unqfy.getUserById(userId);
    return tempUser.getListenedTracks();
  }
}

module.exports = UserHandler;