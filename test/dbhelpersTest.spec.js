var should = require('should');
var monk = require('monk');
var db = monk('localhost/playlister');
var expect = require('expect');
var helpersDatabase = require('../models/helpersDatabase');

describe("connection and initialization of DB",function(){

  it('should be connected',function(done){
    var db = monk('localhost/playlister');
    should.exists(db);
    done();
  });

  it('should get hold of a collection',function(done){
    var db = monk('localhost/playlister');
    var collectionName = db.get("ppSpotifyCredentials");
    should.exists(collectionName);
    done();
  });

});

describe('Database Helper functions - ppSpotifyCredentials',function(){

  beforeEach(function(done){
    var db = monk('localhost/playlister');
    var collectionName = db.get('ppSpotifyCredentials');
    done();
  });

  afterEach(function(done){
    var db = monk('localhost/playlister');
    var collection = db.get('ppSpotifyCredentials');
    collection.drop(function(err){
      if(err) return done(err);
    });
    done();
  });

  it('saveToDatabase: it should save data, eg ppSpotifyCredentials',function(done){
    var collectionObject = {spotifyID:"nameTest",spotifyAccessToken:'9999',
                        spotifyRefreshToken:'8888'};
    var collectionName = 'ppSpotifyCredentials';
    helpersDatabase.saveToDatabase(collectionName,collectionObject, function(err, doc) {
      should.not.exist(err);
      doc.spotifyID.should.equal('nameTest');
      doc.spotifyAccessToken.should.equal('9999');
      doc.spotifyRefreshToken.should.equal('8888');
    });
    done();
  });

  it('readFromDatabase: it should read data', function(done){
    var collectionObject = {spotifyID:"nameTest",spotifyAccessToken:'9999',
                        spotifyRefreshToken:'8888'};
    var collectionName = 'ppSpotifyCredentials';
    db.get(collectionName).insert(collectionObject);
    var ppSpotifyID = 'nameTest';
    var matcher = { spotifyID: ppSpotifyID };
    var fields = {spotifyAccessToken: 1, spotifyRefreshToken: 1, _id: 0};
    helpersDatabase.readFromDatabase(collectionName, matcher, fields, function(err, doc) {
        should.not.exist(err);
        doc.length.should.equal(1);
        doc[0].spotifyAccessToken.should.equal('9999');
        doc[0].spotifyRefreshToken.should.equal('8888');
        done();
    });
  });

  it('readFromDatabase: it should only return the last matching record', function(done){
    var collectionName = 'ppSpotifyCredentials';
    var collectionObject = {spotifyID:"nameTest",spotifyAccessToken:'9999',
                        spotifyRefreshToken:'8888'};
    db.get(collectionName).insert(collectionObject);
    var collectionObject = {spotifyID:"nameTest",spotifyAccessToken:'1111',
                        spotifyRefreshToken:'2222'};
    db.get(collectionName).insert(collectionObject);
    var ppSpotifyID = 'nameTest';
    var matcher = { spotifyID: ppSpotifyID };
    var fields = {spotifyAccessToken: 1, spotifyRefreshToken: 1, _id: 0};
    helpersDatabase.readFromDatabase(collectionName, matcher, fields, function(err, doc) {
        should.not.exist(err);
        doc.length.should.equal(1);
        doc[0].spotifyAccessToken.should.equal('1111');
        doc[0].spotifyRefreshToken.should.equal('2222');
        done();
    });
  });
});

describe('Database Helper functions - readFromDatabaseNoLimits - pgSongChoice',function(){

  beforeEach(function(done){
    var db = monk('localhost/playlister');
    done();
  });

  afterEach(function(done){
    var db = monk('localhost/playlister');
    var collection = db.get('pgSongChoice');
    collection.drop(function(err){
        if(err) return done(err);
    });
    done();
  });

  it('readFromDatabaseNoLimits: it should return all matching records', function(done){
    var collectionName = 'pgSongChoice';
    var collectionObject = {ppPartyName: 'Awesome Party', ppPartyDate: '2015-03-04',
                            pgSongChoice: [ 'spotify:track:4WrVyBdyZBmAkFOVuWFqTj',
                                            'spotify:track:2CkE9VvzIzgoJ97h9AcLHW' ],
                            pgEmail: 'test1@test.com'};
    db.get(collectionName).insert(collectionObject);
    var collectionObject = {ppPartyName: 'Awesome Party', ppPartyDate: '2015-03-04',
                            pgSongChoice: [ 'spotify:track:4WrVyBdyZBmAkFOVuWFqTj',
                                            'spotify:track:2CkE9VvzIzgoJ97h9AcLHW' ],
                            pgEmail: 'test2@test.com'};
    db.get(collectionName).insert(collectionObject);
    var matcher = {ppPartyName: 'Awesome Party', ppPartyDate: '2015-03-04'};
    var fields = {pgSongChoice: 1};
    helpersDatabase.readFromDatabaseNoLimits(collectionName, matcher, fields, function(err, doc) {
        should.not.exist(err);
        doc.length.should.equal(2);
        done();
    });
  });
});
