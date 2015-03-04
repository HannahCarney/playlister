var helpersDatabase = require('./helpersDatabase');
var todaysDate = (new Date()).toISOString().split('T')[0];
var outputRes;

exports.startSearchFromEmail = function(pgEmail, res) {
  outputRes = res;
  var collectionName = 'pgSongChoice';
  var matcher = { pgEmail: pgEmail, ppPartyDate: todaysDate };
  var fields = { ppPartyName: 1, _id: 0};
  var callback = retrieveSpotifyID;
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, callback);
};

var retrieveSpotifyID = function(err, doc) {
  helpersDatabase.errorHandling(err);
  var ppPartyName = doc[0].ppPartyName;
  var collectionName = 'ppEvent';
  var matcher = { partyName: ppPartyName, partyDate: todaysDate };
  var fields = { spotifyID: 1, _id:0};
  var callback = retrieveBeacon;
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, callback);
};

var retrieveBeacon = function(err, doc) {
  helpersDatabase.errorHandling(err);
  var ppSpotifyID = doc[0].spotifyID;
  var collectionName = 'ppBeacon';
  var matcher = { spotifyID: ppSpotifyID };
  var fields = {beaconMajor: 1, beaconMinor: 1, _id: 0};
  var callback = returnBeacon;
  helpersDatabase.readFromDatabase(collectionName, matcher, fields, callback);
};

var returnBeacon = function(err, doc) {
  helpersDatabase.errorHandling(err);
  beaconMajor = doc[0].beaconMajor;
  beaconMinor = doc[0].beaconMinor;
  //Send the beacon data back to the mobile app
  outputRes.jsonp({beaconMajor: beaconMajor, beaconMinor: beaconMinor});
};
