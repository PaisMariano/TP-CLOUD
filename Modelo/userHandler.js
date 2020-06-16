class UserHandler {

  listen(unqfy, userId, trackId) {
    const tempUser = unqfy.getUserById(userId);
    const tempTrack = unqfy.getTrackById(trackId);
    tempUser.listen(tempTrack);
    return tempTrack;
  }

  listenedTracks(unqfy, userId) {
    const tempUser = unqfy.getUserById(userId);
    return tempUser.getListenedTracks();
  }

  removeUser(unqfy, userId) {
    unqfy.users = unqfy.users.filter((user) => user.id !== userId);
  }

  updateUser(unqfy, userId, userData) {
    let tempUser = unqfy.getUserById(userId);
    tempUser.name = userData.name;
  }
}

module.exports = UserHandler;