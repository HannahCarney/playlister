var should = require('should');
var monk = require('monk');
var db = monk('localhost/playlister');
var expect = require('expect');
var helpersDatabase = require('../models/helpersDatabase');
var verifySongChoiceModel = require('../models/verifySongModel');

describe('Database Helper functions - ppSpotifyCredentials',function(){

//Confident it is working
  it('saveToDatabase: it should save data, eg ppSpotifyCredentials',function(done){
    var collectionName = 'ppSpotifyCredentials';
    db.get(collectionName).drop(function() {
      var collectionObject = {spotifyID:"nameTest",spotifyAccessToken:'9999',
                          spotifyRefreshToken:'8888'};
      helpersDatabase.saveToDatabase(collectionName,collectionObject);
      db.get(collectionName).find({}, {}, function(err, doc) {
        doc[0].spotifyID.should.equal('nameTest');
        doc[0].spotifyAccessToken.should.equal('9999');
        doc[0].spotifyRefreshToken.should.equal('8888');
      });
    });
    done();
  });

// Confident it is working
  it('readFromDatabase: it should read data - ppEvent', function(done){
    var collectionName = 'ppEventTest';
    db.get(collectionName).drop(function() {
      var collectionObject = {partyName:'Awesome Party',partyDate:'2015-03-04',
                          playlistName: 'Cool Tunes', spotifyID:'JoeBloggs'};
      db.get(collectionName).insert(collectionObject, function() {
        var matcher = { partyName: 'Awesome Party', partyDate: '2015-03-04' };
        var fields = { spotifyID: 1, _id:0};
        helpersDatabase.readFromDatabase(collectionName, matcher, fields, function(err, doc) {
            should.not.exist(err);
            doc.length.should.equal(1);
            doc[0].spotifyID.should.equal('JoeBloggs');
        });
      });
    });
    done();
  });

// Confident it is working
  it('readFromDatabase: it should only return the last matching record', function(done){
    var collectionName = 'ppBeaconTest';
    db.get(collectionName).drop(function() {
      var collectionObject1 = {spotifyID:"FredJones",beaconMajor:'1234',beaconMinor:'9876'};
      db.get(collectionName).insert(collectionObject1, function() {
        var collectionObject2 = {spotifyID:"FredJones",beaconMajor:'4444',beaconMinor:'5555'};
        db.get(collectionName).insert(collectionObject2, function() {
          var matcher = { spotifyID: 'FredJones' };
          var fields = {beaconMajor: 1, beaconMinor: 1, _id: 0};
          helpersDatabase.readFromDatabase(collectionName, matcher, fields, function(err, doc) {
              should.not.exist(err);
              doc.length.should.equal(1);
              doc[0].beaconMajor.should.equal('4444');
              doc[0].beaconMinor.should.equal('5555');
          });
        });
      });
    });
    done();
  });

});

describe('Database Helper functions - readFromDatabaseNoLimits - pgSongChoice',function(){

// Confident it is working
  it('readFromDatabaseNoLimits: it should return all matching records', function(done){
    var collectionName = 'pgSongChoiceTest';
    db.get(collectionName).drop( function() {
      var collectionObject1 = {ppPartyName: 'Awesome Party', ppPartyDate: '2015-03-04',
                              pgSongChoice: [ 'spotify:track:4WrVyBdyZBmAkFOVuWFqTj',
                                              'spotify:track:2CkE9VvzIzgoJ97h9AcLHW' ],
                              pgEmail: 'test1@test.com'};
      db.get(collectionName).insert(collectionObject1, function() {
        var collectionObject2 = {ppPartyName: 'Awesome Party', ppPartyDate: '2015-03-04',
                                pgSongChoice: [ 'spotify:track:4WrVyBdyZBmAkFOVuWFqTj',
                                                'spotify:track:2CkE9VvzIzgoJ97h9AcLHW' ],
                                pgEmail: 'test2@test.com'};
        db.get(collectionName).insert(collectionObject2, function() {
          var matcher = {ppPartyName: 'Awesome Party', ppPartyDate: '2015-03-04'};
          var fields = {pgSongChoice: 1};
          helpersDatabase.readFromDatabaseNoLimits(collectionName, matcher, fields, function(err, doc) {
              should.not.exist(err);
              doc.length.should.equal(2);
          });
        });
      });
    });
    done();
  });

});
