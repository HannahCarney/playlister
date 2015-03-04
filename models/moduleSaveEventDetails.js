var helpersDatabase = require ('./helpersDatabase');
var partyName;
var partyDate;
var playListName;

exports.saveEventDetails = function(partyName, partyDate, playlistName, spotifyID) {
  //First find party planners Spotify Credentials
  var partyName = partyName;
  var partyDate = partyDate;
  var playListName = playlistName;
  var collectionName = 'ppSpotifyCredentials';
  var matcher = { spotifyID: spotifyID };
  var fields = { spotifyAccessToken: 1, spotifyRefreshToken : 1, spotifyID : 1, _id: 0};
  console.log('set up read from db');
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, createPlaylist);
};


exports.createPlaylist = function(err, doc) {
  console.log('start create playlist: partyName:' + partyName);
  helpersDatabase.errorHandling(err);
  var spotifyApi = new SpotifyWebApi({clientId : clientId,
                                      clientSecret : clientSecret});
  var spotifyID = doc[0].spotifyID;
  spotifyApi.setAccessToken(doc[0].spotifyAccessToken);
  spotifyApi.setRefreshToken(doc[0].spotifyRefreshToken); //Shouldn't need this
  spotifyApi.createPlaylist(spotifyID, playlistName, { 'public' : true })
    .then(function(data) {
      var collectionName = 'ppEvent';
      var collectionObject = {"spotifyID" : data.owner.id,
                              "playlistName" : data.name,
                              "playlistID" : data.id,
                              "partyName" : partyName,
                              "partyDate" : partyDate};
      helpersDatabase.saveToDatabase(collectionName, collectionObject);
    }, function(err) {
      console.log('Spotify Create Playlist - something went wrong! ', err);
    });

};
