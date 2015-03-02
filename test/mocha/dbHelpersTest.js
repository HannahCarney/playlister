var should = require('should');
var monk = require('monk');
var expect = require('expect');
var helpersDB = require('../../models/helpersDatabase');



describe("connection and initialization of DB",function(){

  it('should be connected',function(done){
    var db = monk('localhost/playlisterTest');
    should.exists(db);
    done();
  });

  it('should get hold of a collection',function(done){
    var db = monk('localhost/playlisterTest');
    var collectionName = db.get("ppSpotifyCredentials");
    should.exists(collectionName);
    done();
  });

  it('should store some data',function(done){

  });
});

describe('should add data',function(){

  var db,ppSpotifyCredentials = {};

  beforeEach(function(done){
    var db = monk('localhost/playlisterTest');
    var collectionName = db.get('ppSpotifyCredentials');
  });

  after(function(done){
    monk('localhost/playlisterTest')
    .get('ppSpotifyCredentials')
    .drop(function(err){
      if(err) return done(err);
    });
    done();
  });

  it('should save and read data',function(){
    var collectionObject = {spotifyID:"nameTest",spotifyAccessToken:'9999',
                        spotifyRefreshToken:'8888'};

    helpersDB.saveToDatabase(db,collectionName,collectionObject);
    var collection = db.get(collectionName);
    var element = collection.find();
    elemet.should.have.property('_id','spotifyID',
                                'spotifyAccessToken','spotifyRefreshToken');

  });


});
