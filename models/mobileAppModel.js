

exports.getBeacon = function(req, res) {
  var pgEmail = req.param('email');
  console.log('Party Goers Email: ' + pgEmail);
  var todaysDate = (new Date()).toISOString().split('T')[0];
  var beaconMajor;
  var beaconMinor;
  var ppPartyName;
  var ppSpotifyID;
  // Callback methods to build relationships between DBs
  var retrieveSpotifyID = function(err, doc) {
    if (err) {
      console.log(err);
    }
    ppPartyName = doc[0].ppPartyName;
    collection = db.get('ppEvent');
    collection.find({ partyName: ppPartyName, partyDate: todaysDate },
                    { fields : { spotifyID: 1, _id:0},
                      limit : 1,
                      sort : {$natural : -1}
                    }
      , retrieveBeacon);
  };

  var retrieveBeacon = function(err, doc) {
    if (err) {
      console.log(err);
    }
    ppSpotifyID = doc[0].spotifyID;
    collection = db.get('ppBeacon');
    collection.find({ spotifyID: ppSpotifyID },
                    { fields : {beaconMajor: 1, beaconMinor: 1, _id: 0},
                      limit : 1,
                      sort : {$natural : -1}
                    }
      , returnBeacon);
  };

  var returnBeacon = function(err, doc) {
    if (err) {
      console.log(err);
    }
    beaconMajor = doc[0].beaconMajor;
    beaconMinor = doc[0].beaconMinor;
    res.render('mobileApp/returnBeacons', {beaconMajor: beaconMajor,
                                            beaconMinor: beaconMinor});
  };

  // Start point db retrieval based on url params
  var db = req.db;
  var collection = db.get('pgSongChoice');
  collection.find({ pgEmail: pgEmail, ppPartyDate: todaysDate },
                  { fields : { ppPartyName: 1, _id: 0},
                    limit : 1,
                    sort : {$natural : -1}
                  }
    , retrieveSpotifyID);
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
    if (err) {
      console.log(err);
    }
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
    if (err) {
      console.log(err);
    }
    ppSpotifyAccessToken = doc[0].spotifyAccessToken;
    ppSpotifyRefreshToken = doc[0].spotifyRefreshToken;
    collection = db.get('ppEvent');
    collection.find({ spotifyID: ppSpotifyID, partyDate: todaysDate },
                    { fields : {playlistID: 1, partyName: 1, _id: 0},
                      limit : 1,
                      sort : {$natural : -1}
                    }
      , retrieveSongChoices);
  };

  var retrieveSongChoices = function(err, doc) {
    if (err) {
      console.log(err);
    }
    ppPlaylistID = doc[0].playlistID;
    ppPartyName = doc[0].partyName;
    collection = db.get('pgSongChoice');
    collection.find({ ppPartyName: ppPartyName, ppPartyDate: todaysDate, pgEmail: pgEmail },
                    { fields : {pgSongChoice: 1, _id: 0},
                      limit : 1,
                      sort : {$natural : -1}
                    }
      , returnSongChoices);
  };

  var returnSongChoices = function(err, doc) {
    if (err) {
      console.log(err);
    }
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
  var collection = db.get('ppBeacon');
  collection.find({ beaconMajor: beaconMajor, beaconMinor: beaconMinor },
                  { fields : { spotifyID: 1, _id: 0},
                    limit : 1,
                    sort : {$natural : -1}
                  }
    , retrieveAccessTokens);
};
