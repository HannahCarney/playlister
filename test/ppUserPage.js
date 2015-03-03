var webdriverio = require('webdriverio');
var expect = require('chai').expect;

describe('Beacon details page', function() {

  var client = {};

  before(function(done) {
    client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'}   });
    client.init(done);
  });

  beforeEach(function() {
    client.url('http://localhost:3000/partyplanner/beacon/username');
  });
 
  after(function(done) {
    client.end(done);
  });

  context('When user visits the page', function() {

    it('Should have a title', function(done) {
      client
        .getText('#beacon-title', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql('Please register your party beacon')
        })
        .call(done);
    });

    it('Should display a beacon details form', function(done) {
      client
        .getTagName('#beacon-details-form', function(err, tagName) {
          expect(err).to.not.be.true;
          expect(tagName).to.eql('form')
        })
        .call(done);
    });

  });

  context('When user clicks on save with blank fields', function() {

    it('Should get an error message', function(done) {
      client
        .click('#savebeacon')
        .waitForText('#error', 5000)
        .getText('#error', function(err, text) {
          expect(text).to.eql('You must add beacon numbers')
        })
        .call(done);
    });

  });

  context('When user clicks on save after he filled the fields', function() {

    it('Should go through the next page', function(done) {
      client
        .setValue('#minor', '123')
        .setValue('#major', '123')
        .click('#savebeacon')
        .waitForText('#party-event-form', 5000)
        .getText('#event-info', function(err, text) {
          expect(text).to.eql('Event Info')
        })
        .call(done);
    });

  });

});