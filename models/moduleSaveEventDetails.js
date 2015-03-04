var SpotifyWebApi = require('spotify-web-api-node');
var clientId = process.env.SPOTIFY_CLIENT_ID;
var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
var helpersDatabase = require ('./helpersDatabase');
var partyName;
var partyDate;
var playlistName;

exports.retrieveSpotifyCredentials = function(ppPartyName, ppPartyDate, ppPlaylistName, spotifyID) {
  //First set up variables for later use
  partyName = ppPartyName;
  partyDate = ppPartyDate;
  playlistName = ppPlaylistName;
  // set up parameters for database read
  var collectionName = 'ppSpotifyCredentials';
  var matcher = { spotifyID: spotifyID };
  var fields = { spotifyAccessToken: 1, spotifyRefreshToken : 1, spotifyID : 1, _id: 0};
  // retrieve credentials from database with callback to createPlaylist
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, moduleSaveEventDetails.createPlaylist);
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
