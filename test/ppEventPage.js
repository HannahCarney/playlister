var webdriverio = require('webdriverio');
var expect = require('chai').expect;

describe('Event info page', function() {

  var client = {};

  before(function(done) {
    client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'}   });
    client.init(done);
  });

  beforeEach(function() {
    client.url('http://localhost:3000/partyplanner/eventdetails/username');
  });

  after(function(done) {
    client.end(done);
  });

  context('When the user visits the page', function() {

    it('Should have a title', function(done) {
      client
        .getText('#event-info', function(err, text) {
          expect(text).to.eql('Party Information')
        })
        .call(done);
    });

    it('Should have a party info form', function(done) {
      client
        .getTagName('#party-event-form', function(err, tagName) {
          expect(tagName).to.eql('form')
        })
        .call(done);
    });
  });

  context('When user clicks on save with blank fields', function() {

    it('Should not be allowed to go through', function(done) {
      client
        .click('#saveparty')
        .getText('#event-info', function(err, text) {
          expect(text).to.eql('Party Information')
        })
        .call(done);
    });
  });

});
