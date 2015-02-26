describe('party goer enters songs', function(){

  var host = 'http://localhost:3000/';

  before(function(){
    casper.start(host);
  });

  it('should have a title', function(){
    casper.thenOpen(host + 'pg/get_songs', function(){
      expect('body').to.include.text("Please enter your song choices for Dummy Party on Dummy Date")
    });
  });

  it('should have an email field', function(){
    casper.thenOpen(host + 'pg/get_songs', function(){
      expect('#party-email-form').to.be.inDOM;
    });
  });

  it('should have a search button', function(){
    caspert.thenOpen(host + 'pg/get_songs', function(){
      expect('#song-choices').to.be.inDOM;
    });
  });

});