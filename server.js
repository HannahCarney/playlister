var express = require('express');
var app = express();
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var server = require('http').createServer(app);
var SpotifyWebApi = require('spotify-web-api-node');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/playlister');


var clientId = process.env.SPOTIFY_CLIENT_ID; // Your client id
var clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Your client secret
var redirect_uri = 'http://localhost:3000/pp/authorize/callback'; // Your redirect uri

var spotifyID;
var spotifyAccessToken;
var spotifyRefreshToken;
var userName;
var beaconMajor;
var beaconMinor;
var partyName;
var partyPlaylistName;
var partyDate;

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

app.get('/', function(req, res){
  res.render('index');
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

function saveSpotifyInfo(spotifyID, accessToken, refreshToken) {
  // console.log(spotifyID);
  // console.log(accessToken);
  // console.log(refreshToken);
}

function saveUserInfo(userName, beaconMajor, beaconMinor) {
  // console.log(userName);
  // console.log(beaconMajor);
  // console.log(beaconMinor);
}

function saveEventInfo(partyName, partyPlaylistName, partyDate) {
  // console.log(partyName);
  // console.log(partyPlaylistName);
  // console.log(partyDate);
}


var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

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
      redirect_uri: redirect_uri,
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
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        spotifyAccessToken = body.access_token;
        spotifyRefreshToken = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + spotifyAccessToken },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          spotifyID = body.id;
          // console.log(body);
          saveSpotifyInfo(spotifyID, spotifyAccessToken, spotifyRefreshToken);
          // Set our internal DB variable
          var db = req.db;

          // Set our collection
          var collection = db.get('partygoeraccessdetails');

          // Submit to the DB
          collection.insert({
              "spotifyID" : spotifyID,
              "spotifyAccessToken" : spotifyAccessToken,
              "spotifyRefreshToken" : spotifyRefreshToken
          }, function (err, doc) {
              if (err) {
                  // If it failed, return error
                  console.log("There was a problem adding the information to the database.");
              }
              else {
                  // If it worked, set the header so the address bar doesn't still say /adduser
                  console.log("Party Goer Access Details saved successfully");
              }
          });

        });

        // we can also pass the token to the browser to make requests from there
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
  res.render('user', {userName: spotifyID});
});

app.post('/pp/user', function(req, res){
  userName = req.body.userName;
  beaconMajor = req.body.beaconMajor;
  beaconMinor = req.body.beaconMinor;

  var db = req.db;
  var collection = db.get('partyPlannerBeacon');
  collection.insert({
    "spotifyID" : spotifyID,
    "beaconMajor" : beaconMajor,
    "beaconMinor" : beaconMinor
  }, function(err, doc) {
    if (err) {
      console.log("FAILED: Party Planner Beacon write to db");
    }
    else {
      console.log("SUCCESS: Party Planner Beacon write to db");
    }
  });


  res.redirect('/pp/event');
});

app.get('/pp/event', function(req, res){
  saveUserInfo(userName, beaconMajor, beaconMinor);
  res.render('event');
});

app.post('/pp/event', function(req, res){
  partyName = req.body.eventName;
  partyPlaylistName = req.body.eventPlaylist;
  partyDate = req.body.eventDate;

  var spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret,
    redirectUri : 'http://localhost:3000/pp/playlist/callback'
  });

  spotifyApi.setAccessToken(spotifyAccessToken);

  var playlistId;

  spotifyApi.createPlaylist(spotifyID, partyPlaylistName, { 'public' : true })
    .then(function(data) {
      console.log('Created playlist');
      console.log(typeof (data.id));
      playlistId = data.id;
      console.log('playlist id: ' + playlistId);
      // database storing infos
        var db = req.db;
        var collection = db.get('partyPlannerEvent');
        collection.insert({
          "spotifyID" : spotifyID,
          "partyName" : partyName,
          "partyPlaylistName" : partyPlaylistName,
          "playlistId" : playlistId,
          "partyDate" : partyDate
        }, function(err, doc) {
          if (err) {
            console.log("FAILED: Party Planner Event write to db");
          }
          else {
            console.log("SUCCESS: Party Planner Event write to db");
          }
        console.log('playlist id after callback: ' + playlistId);
        });
        //
    }, function(err) {
      console.log('Something went wrong! ', err);
    });




  res.redirect('/pp/completed');
});

app.get('/pp/completed', function(req, res){
  saveEventInfo(partyName, partyPlaylistName, partyDate);
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

app.post('/pg/get_songs', function(req, res) {
  // var email = req.body.email;
  // var song = req.body.selectedSong;
  res.render('thankYou', {email: req.body.email, song: req.body.selectedSong});
  console.log(req.body.selectedSong);
});

server.listen(app.get('port'), function(){
  console.log('Server running at ' + app.get('port'));
});

module.exports = server;
