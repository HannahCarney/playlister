describe('party planner homepage', function() {

var host = 'http://localhost:3000/';

  before(function(){
    casper.start(host);
  });

  it('should say Welcome to Party Planner', function(){
    casper.then(function() {
      expect('body').to.include.text('Welcome to Party Planner');
    });
  });

});
