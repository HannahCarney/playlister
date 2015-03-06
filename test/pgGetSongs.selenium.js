var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/playlister';
var monk = require('monk');
var db = monk(mongoUri);
var table = db.get('pgSongChoice');

describe('Party goer selecting songs page', function() {

  var client = {};

  before(function(done) {
    this.timeout(999999)
    client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'}   });
    client.init(done);
  });

  beforeEach(function(done) {
    this.timeout(99999)
    client.url('http://localhost:3000/partygoer/getsongs/partyName/partyDate')
    .call(done);
  });

  after(function(done) {
    client.end(done);
  });

  context('When user visits the page', function() {

    it('Should have a title', function(done) {
      client
        .getText('#pg-title', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql('Please choose your party tracks for partyName on partyDate')
        })
        .call(done);
    });

    it('Should have a subtitle', function(done) {
      client
        .getText('#pg-subtitle', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql("Type a track name and click on 'Search'. Then, click on any track from the results to get a 30 second preview.")
        })
        .call(done);
    });

    it('Should have an email form', function(done) {
      client
        .getTagName('#party-email-form', function(err, tagName) {
          expect(err).to.not.be.true;
          expect(tagName).to.eql('form')
        })
        .call(done);
    });

    it('Should have form to choose the song', function(done) {
      client
        .getTagName('#song-choices', function(err, tagName) {
          expect(err).to.not.be.true;
          expect(tagName).to.eql('form')
        })
        .call(done);
    });
  });

  context('When user selects a song', function() {

    it('Should not go through when does not enter a valid email', function(done) {
      client
        .setValue('#query', 'give it all')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#4d4AIYFkR8MSWtKBmphyir1')
        .click('#addSong')
        .setValue('#email', 'blahblah')
        .click('#go')
        .getText('#pg-title', function(err, text) {
          expect(text).to.eql('Please choose your party tracks for partyName on partyDate')
        })
        .call(done);
    });

    it('Should see a list of songs', function(done) {
      client
        .setValue('#query', 'superstition')
        .click('#search')
        .waitFor('.cover', 5000)
        .getText('#results', function(err, text) {
          expect(text).to.include('Stevie Wonder: Superstition - Single Version')
        })
        .call(done);
    });

    it('Should be able to select a song', function(done) {
      client
        .setValue('#query', 'give it all')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#4d4AIYFkR8MSWtKBmphyir1')
        .click('#addSong')
        .setValue('#email', 'rock@email.com')
        .click('#go')
        .waitFor('#thank-you', 5000)
        .getText('#thank-you', function(err, text) {
          expect(text).to.include("Thanks, we've saved your party track choices for")
        })
        .call(done);
    });

    it('Should be able to add two songs to his choices', function(done) {
      client
        .setValue('#query', 'give it all')
        .click('#search')
        .waitFor('#4d4AIYFkR8MSWtKBmphyir1', 5000)
        .click('#4d4AIYFkR8MSWtKBmphyir1')
        .click('#addSong')
        .setValue('#query', 'stone sour')
        .click('#search')
        .waitFor('#6UFhNbE4sLRUoM52kC4Xl41', 5000)
        .click('#6UFhNbE4sLRUoM52kC4Xl41')
        .click('#addSong')
        .setValue('#email', 'rock@email.com')
        .click('#go')
        .waitFor('#thank-you', 5000)
        .getText('#thank-you', function(err, text) {
          expect(text).to.include("Thanks, we've saved your party track choices for")
        })
        .call(done);
      });

    it('Should not be able to click button without a song added', function(done) {
      client
        .setValue('#query', 'superstition')
        .click('#search')
        .click("#addSong")
        .waitFor('#errormessage', 5000)
        .getText('#errormessage', function(err, text) {
          expect(text).to.eql('You need to select a song first.')
        })
        .call(done);
    });

    it('Should get an error if that song has already been selected', function(done) {
      client
        .setValue('#query', 'superstition')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#300RfAPZ57B0y6YYj9n6DN1')
        .click('#addSong')
        .setValue('#email', 'partygoer@email.com')
        .click('#go')
        .url('http://localhost:3000/partygoer/getsongs/partyName/partyDate')
        .waitForExist('#search', 5000)
        .setValue('#query', 'superstition')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#300RfAPZ57B0y6YYj9n6DN1')
        .click('#addSong')
        .waitFor('#errormessage', 5000)
        .getText('#errormessage', function(err, text) {
          expect(text).to.eql('Song has been picked for this party already')
        })
        .call(done);
    });

    it('Should not go through', function(done) {
      client
        .setValue('#email', 'rock@email.com')
        .click('#go')
        .getText('#pg-title', function(err, text) {
          expect(text).to.eql('Please choose your party tracks for partyName on partyDate')
        })
        .call(done)
    });
  });

  table.drop();

});
