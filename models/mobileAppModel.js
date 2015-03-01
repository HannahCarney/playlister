

exports.getBeacon = function(req, res) {
  var pgEmail = req.param('email');
  console.log('Party Goers Email: ' + pgEmail);
  var todaysDate = (new Date()).toISOString().split('T')[0];
  var beaconMajor;
  var beaconMinor;
  var ppPartyName;
  var ppSpotifyID;

  var db = req.db;
  var collection = db.get('pgSongChoice');

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

  collection.find({ pgEmail: pgEmail, ppPartyDate: todaysDate },
                  { fields : { ppPartyName: 1, _id: 0},
                    limit : 1,
                    sort : {$natural : -1}
                  }
    , retrieveSpotifyID);
};
