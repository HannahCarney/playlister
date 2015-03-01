var querystring = require('querystring');
var request = require('request');
var helpers = require('./helpers');
var SpotifyWebApi = require('spotify-web-api-node');
var clientId = process.env.SPOTIFY_CLIENT_ID;
var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
var redirect_uri_authorize = process.env.SPOTIFY_AUTHORIZE_CALLBACK;
var redirect_uri_create_playlist = process.env.SPOTIFY_CREATE_PLAYLIST_CALLBACK;
var stateKey = 'spotify_auth_state';
var spotifyID;
var playlistName;

//functions called by controllers
exports.authorizeSpotify = function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  var scope = 'playlist-modify-public playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({response_type: 'code',
                          client_id: clientId,
                          scope: scope,
                          redirect_uri: redirect_uri_authorize,
                          state: state})
              );
};

exports.authorizeSpotifyCallback = function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' + querystring.stringify({error: 'state_mismatch'}));
  }
  else {
    res.clearCookie(stateKey);
    var authOptions = {
      url:      'https://accounts.spotify.com/api/token',
      form:     {code: code,
                redirect_uri: redirect_uri_authorize,
                grant_type: 'authorization_code'},
      headers:  {'Authorization': 'Basic ' +
                (new Buffer(clientId + ':' + clientSecret).toString('base64'))},
      json:     true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
          var spotifyAccessToken = body.access_token;
          var spotifyRefreshToken = body.refresh_token;
          var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + spotifyAccessToken },
          json: true
        };

        // use access token to get party planner credentials from Spotify API
        request.get(options, function(error, response, body) {
          spotifyID = body.id;
          saveTokensToDatabase(req, spotifyID, spotifyAccessToken, spotifyRefreshToken);
        });
        res.redirect('/partyplanner/beacon');
      }
      else {
        res.redirect('/' + querystring.stringify({error: 'invalid_token'}));
      }
    });
  }
};

exports.saveBeacon = function(req, res) {
  var beaconMajor = req.body.beaconMajor;
  var beaconMinor = req.body.beaconMinor;
  var collection = req.db.get('ppBeacon');
  saveBeaconToDatabase(collection, beaconMajor, beaconMinor);
  res.redirect('/partyplanner/eventdetails');
};

exports.saveEventDetails = function(req, res) {
  var partyName = req.body.partyName;
  var partyDate = req.body.partyDate;
  var playlistName = req.body.playlistName;

  var spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret,
    redirectUri : process.env.SECOND_CALLBACK
  });

  var callback = function(err, doc) {
    if (err) {
      console.log(err);
    }
    spotifyApi.setAccessToken(doc[0].spotifyAccessToken);
    spotifyApi.setRefreshToken(doc[0].spotifyRefreshToken);

    spotifyApi.createPlaylist(spotifyID, playlistName, { 'public' : true })
      .then(function(data) {
        var playlistID = data.id;
        var db = req.db;
        var collectionName = 'ppEvent';
        var collectionObject = {"spotifyID" : spotifyID,
                                "playlistName" : playlistName,
                                "playlistID" : playlistID,
                                "partyName" : partyName,
                                "partyDate" : partyDate};
        helpers.saveToDatabase(db,
                              collectionName,
                              collectionObject);
      }, function(err) {
        console.log('Something went wrong! ', err);
      });

    res.redirect('/partyplanner/completed/' + partyName + '/'
                                            + partyDate + '/'
                                            + playlistName);
  };

  var collection = req.db.get('ppSpotifyCredentials');
  collection.find( { spotifyID: spotifyID },{
      fields : { spotifyAccessToken: 1, spotifyRefreshToken : 1, _id: 0},
      limit : 1,
      sort : {$natural : -1}
    }
    , callback);

};


//helper functions

/**
  * Used in Spotify Authorization to generate a required state variable
  * Generates a random string containing numbers and letters
  * @param  {number} length The length of the string
  * @return {string} The generated string
  */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var saveTokensToDatabase = function(req, spotifyID, spotifyAccessToken, spotifyRefreshToken) {
  var collection = req.db.get('ppSpotifyCredentials');
  collection.insert({
      "spotifyID"           : spotifyID,
      "spotifyAccessToken"  : spotifyAccessToken,
      "spotifyRefreshToken" : spotifyRefreshToken
  }, function (err, doc) {
      if (err) {
          console.log("FAILURE: writing to ppSpotifyCredentials");
      }
      else {
          console.log("SUCCESS: writing to ppSpotifyCredentials");
      }
  });
};

var saveBeaconToDatabase = function(collection, beaconMajor, beaconMinor) {
  collection.insert({
    "spotifyID" : spotifyID,
    "beaconMajor" : beaconMajor,
    "beaconMinor" : beaconMinor
  }, function(err, doc) {
    if (err) {
      console.log("FAILED: write to ppBeacon");
    }
    else {
      console.log("SUCCESS: write to ppBeacon");
    }
  });
};
