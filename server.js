var express = require('express');
var app = express();
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);

var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your client secret
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
  console.log(spotifyID);
  console.log(accessToken);
  console.log(refreshToken);
};

function saveUserInfo(userName, beaconMajor, beaconMinor) {
  console.log(userName);
  console.log(beaconMajor);
  console.log(beaconMinor);
};

function saveEventInfo(partyName, partyPlaylistName, partyDate) {
  console.log(partyName);
  console.log(partyPlaylistName);
  console.log(partyDate);
};


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
      client_id: client_id,
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
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        spotifyAccessToken = body.access_token,
        spotifyRefreshToken = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + spotifyAccessToken },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          spotifyID = body.id;
          console.log(body);
          saveSpotifyInfo(spotifyID, spotifyAccessToken, spotifyRefreshToken);
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
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
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

server.listen(app.get('port'), function(){
  console.log('Server running at ' + app.get('port'));
});

module.exports = server;
