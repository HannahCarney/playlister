var helpersDatabase = require('./helpersDatabase');
var helpersSpotify = require('./helpersSpotify');
var todaysDate = (new Date()).toISOString().split('T')[0];
var pgEmail;
var ppSpotifyID;
var playlistAction;
var ppSpotifyAccessToken;
var ppSpotifyRefreshToken;
var ppSpotifyPlaylistID;
var ppPartyName;

exports.songs = function(res, beaconMinor, beaconMajor, email, action) {
  pgEmail = email;
  playlistAction = action;
  outputRes = res;
  var collectionName = 'ppBeacon';
  var matcher = { beaconMajor: beaconMajor, beaconMinor: beaconMinor };
  var fields = { spotifyID: 1, _id: 0};
  var callback = retrieveAccessTokens;
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, callback);
};

var retrieveAccessTokens = function(err, doc) {
  helpersDatabase.errorHandling(err);
  ppSpotifyID = doc[0].spotifyID;
  var collectionName = 'ppSpotifyCredentials';
  var matcher = { spotifyID: ppSpotifyID };
  var fields = {spotifyAccessToken: 1, spotifyRefreshToken: 1, _id: 0};
  var callback = retrieveEventDetails;
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, callback);
};

var retrieveEventDetails = function(err, doc) {
  helpersDatabase.errorHandling(err);
  ppSpotifyAccessToken = doc[0].spotifyAccessToken;
  ppSpotifyRefreshToken = doc[0].spotifyRefreshToken;
  var collectionName = 'ppEvent';
  var matcher = { spotifyID: ppSpotifyID, partyDate: todaysDate };
  var fields = {playlistID: 1, partyName: 1, _id: 0};
  var callback = retrieveSongChoices;
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, callback);
};

var retrieveSongChoices = function(err, doc) {
  helpersDatabase.errorHandling(err);
  ppSpotifyPlaylistID = doc[0].playlistID;
  ppPartyName = doc[0].partyName;
  var collectionName = 'pgSongChoice';
  var matcher = { ppPartyName: ppPartyName, ppPartyDate: todaysDate, pgEmail: pgEmail };
  var fields = {pgSongChoice: 1, _id: 0};
  var callback = returnSongChoices;
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, callback);
};

var returnSongChoices = function(err, doc) {
  helpersDatabase.errorHandling(err);
  var pgSongChoice = doc[0].pgSongChoice;
  var credentials = {spotifyAccessToken: ppSpotifyAccessToken,
                    spotifyRefreshToken: ppSpotifyRefreshToken};
  var tracks = {  spotifyID: ppSpotifyID,
                  playlistID: ppSpotifyPlaylistID,
                  tracks: pgSongChoice};
  if (playlistAction === 'add') {
    helpersSpotify.addSongsToPlaylist(credentials, tracks);
    outputRes.jsonp({confirmation: 'Your tracks have been added to the party playlist'});
  }
  else if (playlistAction === 'remove') {
    helpersSpotify.removeSongsFromPlaylist(credentials, tracks);
    outputRes.jsonp({confirmation: 'Your tracks have been removed from the party playlist'});
  }
  else {
    console.log('Songs: unknown action');
  }
};
