var should = require('should');
var monk = require('monk');
var db = monk('localhost/playlister');
var expect = require('expect');
var helpersDatabase = require('../models/helpersDatabase');
var verifySongChoiceModel = require('../models/verifySongModel');

describe("verify song choices - server model",function(){

  it('should return a flattened array of all songs in the database for a party',function(done){
    var collectionName = 'pgSongChoice';
    db.get(collectionName).drop();
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
    verifySongChoiceModel.verifySongChoices('Awesome Party', '2015-03-04', function(flattenedArray){
      flattenedArray.length.should.equal(4);
      // flattenedArray.should.equal(['spotify:track:4WrVyBdyZBmAkFOVuWFqTj','spotify:track:2CkE9VvzIzgoJ97h9AcLHW','spotify:track:4WrVyBdyZBmAkFOVuWFqTj','spotify:track:2CkE9VvzIzgoJ97h9AcLHW']);
      done();
    });
  });

});
