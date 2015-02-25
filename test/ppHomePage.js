describe('party planner homepage', function() {

var host = 'http://localhost:3000';

  before(function(){
    casper.start(host);
  });

  it('should say hello world', function(){
    casper.thenOpen(host + '/', function() {
      expect('body').to.have.text('Hello World');
    });
  });

};
