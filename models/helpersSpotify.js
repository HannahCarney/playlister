var SpotifyWebApi = require('spotify-web-api-node');
var clientId = process.env.SPOTIFY_CLIENT_ID;
var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

exports.addSongsToPlaylist = function(credentials, pgTracks) {
  var spotifyApi = new SpotifyWebApi( {clientId : clientId,
                                      clientSecret : clientSecret});
  spotifyApi.setRefreshToken(credentials.spotifyRefreshToken);
  spotifyApi.refreshAccessToken()
    .then(function(data) {
      spotifyApi.setAccessToken(data['access_token']);
      return spotifyApi.addTracksToPlaylist(pgTracks.spotifyID, pgTracks.playlistID
                                      , [pgTracks.tracks])
    }).then(function(data) {
      console.log('Added tracks to the playlist!');
    }).catch(function(err) {
      console.log('Something went wrong!', err);
    });
};

exports.removeSongsFromPlaylist = function(credentials, pgTracks) {
  var spotifyApi = new SpotifyWebApi( {clientId : clientId,
                                      clientSecret : clientSecret});
  spotifyApi.setRefreshToken(credentials.spotifyRefreshToken);
  spotifyApi.refreshAccessToken()
    .then(function(data) {
      spotifyApi.setAccessToken(data['access_token']);
      return spotifyApi.removeTracksFromPlaylist(pgTracks.spotifyID, pgTracks.playlistID
                                      , {tracks : [uri : pgTracks.tracks] })
    }).then(function(data) {
      console.log('Removed tracks from the playlist!');
    }).catch(function(err) {
      console.log('Something went wrong!', err);
    });
};
