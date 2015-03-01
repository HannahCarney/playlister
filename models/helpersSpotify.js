var SpotifyWebApi = require('spotify-web-api-node');

exports.addSongsToPlaylist = function(credentials, tracks) {
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(credentials.spotifyAccessToken);
  spotifyApi.setRefreshToken(credentials.spotifyRefreshToken);
  spotifyApi.addTracksToPlaylist(tracks.spotifyID, tracks.playlistID
                                , tracks.tracks)
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
};
