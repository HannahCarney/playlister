var helpers = require('./helpers');

exports.getBeacon = function(req, res) {
  // Variables currently known
  var db = req.db;
  var pgEmail = req.param('email');
  var todaysDate = (new Date()).toISOString().split('T')[0];
  // Variables that will be needed
  var beaconMajor;
  var beaconMinor;
  var ppPartyName;
  var ppSpotifyID;

  // Callback methods to build relationships between DBs
  var retrieveSpotifyID = function(err, doc) {
    helpers.errorHandling(err);
    ppPartyName = doc[0].ppPartyName;
    var collectionName = 'ppEvent';
    var matcher = { partyName: ppPartyName, partyDate: todaysDate };
    var fields = { spotifyID: 1, _id:0};
    var callback = retrieveBeacon;
    helpers.readFromDatabase(db, collectionName, matcher, fields, callback);
  };

  var retrieveBeacon = function(err, doc) {
    helpers.errorHandling(err);
    ppSpotifyID = doc[0].spotifyID;
    var collectionName = 'ppBeacon';
    var matcher = { spotifyID: ppSpotifyID };
    var fields = {beaconMajor: 1, beaconMinor: 1, _id: 0};
    var callback = returnBeacon;
    helpers.readFromDatabase(db, collectionName, matcher, fields, callback);
  };

  var returnBeacon = function(err, doc) {
    helpers.errorHandling(err);
    beaconMajor = doc[0].beaconMajor;
    beaconMinor = doc[0].beaconMinor;
    res.render('mobileApp/returnBeacons', {beaconMajor: beaconMajor,
                                            beaconMinor: beaconMinor});
  };
  // End of callbacks

  // Start point db retrieval based on url params
  var collectionName = 'pgSongChoice';
  var matcher = { pgEmail: pgEmail, ppPartyDate: todaysDate };
  var fields = { ppPartyName: 1, _id: 0};
  var callback = retrieveSpotifyID;
  helpers.readFromDatabase(db, collectionName, matcher, fields, callback);
};

exports.addSongs = function(req, res) {
  var beaconMajor = req.param('beaconMajor');
  var beaconMinor = req.param('beaconMinor');
  var pgEmail = req.param('email');
  var todaysDate = (new Date()).toISOString().split('T')[0];
  //Set up link to db
  var db = req.db;
  var collection;
  //Set up variables required to pass back
  var ppSpotifyID;
  var ppSpotifyAccessToken;
  var ppSpotifyRefreshToken;
  var ppSpotifyPlayListId;
  var ppPartyName;
  var pgSongChoice;

  var retrieveAccessTokens = function(err, doc) {
    helpers.errorHandling(err);
    ppSpotifyID = doc[0].spotifyID;
    collection = db.get('ppSpotifyCredentials');
    collection.find({ spotifyID: ppSpotifyID },
                    { fields : {spotifyAccessToken: 1, spotifyRefreshToken: 1, _id: 0},
                      limit : 1,
                      sort : {$natural : -1}
                    }
      , retrieveEventDetails);
  };

  var retrieveEventDetails = function(err, doc) {
    helpers.errorHandling(err);
    ppSpotifyAccessToken = doc[0].spotifyAccessToken;
    ppSpotifyRefreshToken = doc[0].spotifyRefreshToken;
    var collectionName = 'ppEvent';
    var matcher = { spotifyID: ppSpotifyID, partyDate: todaysDate };
    var fields = {playlistID: 1, partyName: 1, _id: 0};
    var callback = retrieveSongChoices;
    helpers.readFromDatabase(db, collectionName, matcher, fields, callback);
  };

  var retrieveSongChoices = function(err, doc) {
    helpers.errorHandling(err);
    ppPlaylistID = doc[0].playlistID;
    ppPartyName = doc[0].partyName;
    var collectionName = 'pgSongChoice';
    var matcher = { ppPartyName: ppPartyName, ppPartyDate: todaysDate, pgEmail: pgEmail };
    var fields = {pgSongChoice: 1, _id: 0};
    var callback = returnSongChoices;
    helpers.readFromDatabase(db, collectionName, matcher, fields, callback);

  };

  var returnSongChoices = function(err, doc) {
    helpers.errorHandling(err);
    pgSongChoice = doc[0].pgSongChoice;
    res.render('mobileApp/returnSongChoice', {
      credentials: {spotifyAccessToken: ppSpotifyAccessToken,
                    spotifyRefreshToken: ppSpotifyRefreshToken},
      tracks: { spotifyID: ppSpotifyID,
                playlistID: ppPlaylistID,
                tracks: [pgSongChoice]
              }
    });
  };

  // Start point db retrieval based on url params
  var collectionName = 'ppBeacon';
  var matcher = { beaconMajor: beaconMajor, beaconMinor: beaconMinor };
  var fields = { spotifyID: 1, _id: 0};
  var callback = retrieveAccessTokens;
  helpers.readFromDatabase(db, collectionName, matcher, fields, callback);
};
