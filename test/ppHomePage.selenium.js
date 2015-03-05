var webdriverio = require('webdriverio');
var expect = require('chai').expect;

describe('Homepage', function() {

  var client = {};

  before(function(done) {
    this.timeout(99999)
    client = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'}   });
    client.init(done);
  });

  beforeEach(function(done) {
    client.url('http://localhost:3000')
    .call(done)
  });
 
  after(function(done) {
    client.end(done);
  });

  context('When the user is not signed in', function() {

    it("Should have a title", function(done) {
      client
        .getText('#welcome-title', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql('Welcome to TurnUp TuneIn')
        })
        .call(done);
    });

    it("Should have a subtitle", function(done) {
      client
        .getText('#welcome-subtitle', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql('A better way to plan parties')
        })
        .call(done);
    });

    it("Should have a 'log in with Spotify' button", function(done) {
      client
        .getText('#spotify-login', function(err, text) {
          expect(err).to.not.be.true;
          expect(text).to.eql('Log in with Spotify')
        })
        .call(done);
    });

  });

});