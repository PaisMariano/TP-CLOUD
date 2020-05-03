class UserHandler{
    
  listen(unqfy, userId, trackId){
    let tempUser  = uqnfy.getUserById(userId);
    let tempTrack = unqfy.getTrackById(trackId);
    tempUser.listen(tempTrack);
  }
}

module.exports = UserHandler;