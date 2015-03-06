var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/playlister';
var monk = require('monk');
var db = monk(mongoUri);
var ppSpotifyTable = db.get('ppSpotifyCredentials');
var ppBeaconTable = db.get('ppBeacon');
var ppEventTable = db.get('ppEvent');
var pgSongChoiceTable = db.get('pgSongChoice');
var todaysDate = (new Date()).toISOString().split('T')[0];

describe('mobile app web calls', function() {

  var client = {}

  before(function(done) {
    this.timeout(999999);
    ppSpotifyTable.insert({
      spotifyID : 'Fred',
      spotifyAccessToken: 'XYZ123',
      spotifyRefreshToken: 'ABC789'
    });

    ppBeaconTable.insert({
      spotifyID : 'Fred',
      beaconMajor: '123',
      beaconMinor: '456'
    });

    ppEventTable.insert({
      spotifyID : 'Fred',
      playlistName: 'playlist',
      playlistID: 'playlistid',
      partyName: 'graduation',
      partyDate: todaysDate
    });

    pgSongChoiceTable.insert({
      pgEmail: 'fred@rocker.com',
      ppPartyName: 'graduation',
      ppPartyDate: todaysDate,
      pgSongChoice: ['song1', 'song2']
    });

    client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'}   });
    client.init(done);
  });

  after(function(done) {
    client.end(done);
  });

  context('retrieving beacons ids', function(){

    it('should give the right beacon numbers if you have a party today', function(done) {
      client
        .url('http://localhost:3000/mobileapp/getbeacon?email=fred@rocker.com')
        .getText('body', function(err, text) {
          expect(text).to.eql('{"beaconMajor":"123","beaconMinor":"456"}');
        })
        .call(done);
    });

    it('should give the default beacon numbers if you don\'t have a party today', function(done) {
      client
        .url('http://localhost:3000/mobileapp/getbeacon?email=fake@rocker.com')
        .getText('body', function(err, text) {
          expect(text).to.eql('{"beaconMajor":"-1000","beaconMinor":"-1000"}');
        })
        .call(done);
    });
  });

  context('adding and removing songs from the playlist', function() {

    it('should confirm that the songs have been added', function(done) {
      client
        .url('http://localhost:3000/mobileapp/songs?email=fred@rocker.com&beaconMajor=123&beaconMinor=456&action=add')
        .getText('body', function(err, text) {
          expect(text).to.eql('{"confirmation":"Your tracks have been added to the party playlist"}');
        })
        .call(done);
    });

    it('should confirm that the songs have been removed', function(done) {
      client
        .url('http://localhost:3000/mobileapp/songs?email=fred@rocker.com&beaconMajor=123&beaconMinor=456&action=remove')
        .getText('body', function(err, text) {
          expect(text).to.eql('{"confirmation":"Your tracks have been removed from the party playlist"}');
        })
        .call(done);
    });

    it('should respond negatively if the user has not songs for the party', function(done) {
      client
        .url('http://localhost:3000/mobileapp/songs?email=fake@rocker.com&beaconMajor=123&beaconMinor=456&action=add')
        .getText('body', function(err, text) {
          expect(text).to.eql('{"confirmation":"Sorry we could not find any songs for you"}');
        })
        .call(done);
    });

  });

});