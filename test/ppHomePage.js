describe('party planner homepage', function() {

var host = 'http://localhost:3000/';

  before(function(){
    casper.start(host);
  });

  after(function(){
    setTimeout(function() {
      phantom.exit();
    }, 0);
  });

  it('should say hello world', function(){
    // casper.thenOpen(host + '/', function() {
    casper.then(function(
      expect('body').to.have.text('Hello World');
    });
  });

};
