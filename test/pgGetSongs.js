var webdriverio = require('webdriverio');
var expect = require('chai').expect;

describe('Party goer selecting songs page', function() {

  var client = {};

  before(function(done) {
    client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'}   });
    client.init(done);
  });

  beforeEach(function() {
    client.url('http://localhost:3000/partygoer/getsongs/partyName/partyDate');
  });
 
  after(function(done) {
    client.end(done);
  });

  context('When user visits the page', function() {

    it('Should have a title', function(done) {
      client
        .getText('#pg-title', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql('Please enter your song choices for partyName on partyDate')
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

    it('Should select a song', function(done) {
      client
        .setValue('#email', 'partygoer@email.com')
        .setValue('#query', 'superstition')
        .click('#search')
        .waitFor('.cover', 5000)
        .click('#300RfAPZ57B0y6YYj9n6DN')
        .click('#submit')
        .waitFor('#thank-you')
        .getText('#thank-you', function(err, text) {
          expect(text).to.include('hello partygoer@email.com, your song id is')
        })
        .call(done);
    });
  });

});