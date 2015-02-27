// Server
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Dependencies
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');

// Database
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/playlister';
var monk = require('monk')
   , db = monk(mongoUri);

// Spotify Requirements
var SpotifyWebApi = require('spotify-web-api-node');
var clientId = process.env.SPOTIFY_CLIENT_ID; // Your client id
var clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Your client secret
var redirect_uri_first = process.env.FIRST_CALLBACK; // Your redirect uri
var redirect_uri_second = process.env.SECOND_CALLBACK; // Your redirect uri
var stateKey = 'spotify_auth_state';

// Glocal Variables
var spotifyID;
var partyName;
var partyPlaylistName;
var partyDate;

// Server Set-up
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
    .use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(expressLayouts);

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.set('port', (process.env.PORT || 3000));

// Routes
app.get('/', function(req, res){
  res.render('index');
});

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

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'playlist-modify-public playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirect_uri_first,
      state: state
    }));
});

app.get('/pp/authorize/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri_first,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
      },
      json: true
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

          var collection = req.db.get('ppSpotifyCredentials');

          collection.insert({
              "spotifyID" : spotifyID,
              "spotifyAccessToken" : spotifyAccessToken,
              "spotifyRefreshToken" : spotifyRefreshToken
          }, function (err, doc) {
              if (err) {
                  console.log("FAILURE: writing to ppSpotifyCredentials");
              }
              else {
                  console.log("SUCCESS: writing to ppSpotifyCredentials");
              }
          });

        });

        res.redirect('/pp/user');
      }
      else {
        res.redirect('/' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/pp/user', function(req, res){
  res.render('user');
});

app.post('/pp/user', function(req, res){
  var beaconMajor = req.body.beaconMajor;
  var beaconMinor = req.body.beaconMinor;

  var collection = req.db.get('ppBeacon');
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

  res.redirect('/pp/event');
});

app.get('/pp/event', function(req, res){
  res.render('event');
});

app.post('/pp/event', function(req, res){
  var partyName = req.body.eventName;
  var partyPlaylistName = req.body.eventPlaylist;
  var partyDate = req.body.eventDate;

  var spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret,
    redirectUri : process.env.SECOND_CALLBACK
  });


  var collection = req.db.get('ppSpotifyCredentials');
  var ppSpotifyAccessTokenDB = collection.findOne( { spotifyID: spotifyID },
                {spotifyAccessToken: 1, _id: 0});
                // .limit(1).sort({$natural:-1});
  var spotifyAccessToken = ppSpotifyAccessTokenDB.spotifyAccessToken;
  console.log(ppSpotifyAccessTokenDB);
  console.log(spotifyAccessToken);
  spotifyApi.setAccessToken(spotifyAccessToken);

  // var playlistId;

  spotifyApi.createPlaylist(spotifyID, partyPlaylistName, { 'public' : true })
    .then(function(data) {
      var playlistId = data.id;

      // database storing infos
        var collection = req.db.get('ppEvent');
        collection.insert({
          "spotifyID" : spotifyID,
          "partyName" : partyName,
          "partyPlaylistName" : partyPlaylistName,
          "playlistId" : playlistId,
          "partyDate" : partyDate
        }, function(err, doc) {
          if (err) {
            console.log("FAILED: write to ppEvent");
          }
          else {
            console.log("SUCCESS: write to ppEvent");
          }
        });
        //
    }, function(err) {
      console.log('Something went wrong! ', err);
    });

  res.redirect('/pp/completed');
});

app.get('/pp/completed', function(req, res){
  res.render('completed', { partyName: partyName,
    partyPlaylistName: partyPlaylistName, partyDate: partyDate});
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/pg/get_songs', function(req, res){
  var pgPartyName = "Dummy Party";
  var pgPartyDate = "Dummy Date";
  res.render('getSongs', {pgName: pgPartyName, pgDate: pgPartyDate});
});

server.listen(app.get('port'), function(){
  console.log('Server running at ' + app.get('port'));
});

module.exports = server;
