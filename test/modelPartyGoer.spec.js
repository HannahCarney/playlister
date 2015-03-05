var should = require('should');
var monk = require('monk');
var db = monk('localhost/playlister');
var expect = require('expect');
var partyGoerModel = require('../models/partyGoerModel');

describe('Party Goer Model', function() {

  it('should save song choices', function(done) {
    db.get('pgSongChoice').drop();
    partyGoerModel.saveSongChoices('Awesome Party', '2015-03-04', 'joe@test.com',
    ['spotify:track:4WrVyBdyZBmAkFOVuWFqTj','spotify:track:2CkE9VvzIzgoJ97h9AcLHW']);
    db.get('pgSongChoice').find({}, {}, function(err, doc) {
      should.not.exist(err);
      doc.length.should.equal(1);
      doc[0].pgEmail.should.equal('joe@test.com');
      doc[0].ppPartyName.should.equal('Awesome Party');
      doc[0].ppPartyDate.should.equal('2015-03-04');
    });
    done();
  });

});
