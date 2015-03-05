var should = require('should');
var monk = require('monk');
var db = monk('localhost/playlister');
var expect = require('expect');
var partyPlannerModel = require('../models/partyPlannerModel');

describe('Party Planner Model', function() {

  it('should save beacon details', function(done) {
    db.get('ppBeacon').drop(function() {
      partyPlannerModel.saveBeacon('geoffcapes', '12345', '1234');
      db.get('ppBeacon').find({}, {}, function(err, doc) {
        should.not.exist(err);
        doc.length.should.equal(1);
        doc[0].spotifyID.should.equal('geoffcapes');
        doc[0].beaconMajor.should.equal('12345');
        doc[0].beaconMinor.should.equal('1234');
      });
    });
    done();
  });

// Private Method
  xit('should save token details', function(done) {
    db.get('ppSpotifyCredentials').drop(function() {
      partyPlannerModel.saveTokensToDatabase('paxman', 'XC638HHJBhgj6', 'KJHEQFj09dGH');
      db.get('ppSpotifyCredentials').find({}, {}, function(err, doc) {
        should.not.exist(err);
        doc.length.should.equal(1);
        doc[0].spotifyID.should.equal('p');
        doc[0].spotifyAccessToken.should.equal('XC638HHJBhgj6');
        doc[0].spotifyRefreshToken.should.equal('KJHEQFj09dGH');
      });
    });
    done();
  });

// Dependent upon Spotify
  xit('should save event details', function(done) {
    db.get('ppEvent').drop();
    partyPlannerModel.saveEventDetails('Cool Party', '2015-03-17', 'Awesome Tunes', 'JohnMajor');
    db.get('ppEvent').find({}, {}, function(err, doc) {
      should.not.exist(err);
      doc.length.should.equal(1);
      doc[0].spotifyID.should.equal('JohnMajor');
      doc[0].partyName.should.equal('Cool Party');
      doc[0].partyDate.should.equal('2015-03-17');
      doc[0].playlistName.should.equal('Awesome Tunes');
    });
    done();
  });

});
