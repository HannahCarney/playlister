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
          expect(text).to.eql('Event Info')
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

  // context('When user clicks on save after he filled the fields', function() {

  //   it('Should go through the next page with the right details', function(done) {
  //     client
  //       .setValue('#partyName', 'House Party')
  //       .setValue('#playlistName', 'Rock the world!')
  //       .findElement(By.id("datepicker")).click(); 
  //       .setValue('#partyDate', '05-08 2015')
  //       .click('#save')
  //       .waitForText('#ty', 5000)
  //       .getText('#ty', function(err, text) {
  //         expect(text).to.eql('Thank you for entering your party information.')
  //       })
  //       .getText('#pn', function(err, text) {
  //         expect(text).to.eql('Party Name: House Party')
  //       })
  //       .getText('#ppl', function(err, text) {
  //         expect(text).to.eql('Party Playlist Name: Rock the world!')
  //       })
  //       .getText('#pd', function(err, text) {
  //         expect(text).to.eql('Party Date: 05/08/2015')
  //       })
  //       .call(done);
  //   });
  // });

  // context('When user clicks on save with blank fields', function() {

  //   it('Should get an error message', function(done) {
  //     client
  //       .click('#save')
  //       .waitForText('#error', 5000)
  //       .getText('#error', function(err, text) {
  //         expect(text).to.eql('You must add party infos')
  //       })
  //       .call(done);
  //   });
  // });

});