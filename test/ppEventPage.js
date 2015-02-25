describe('party planner event page', function() {

var host = 'http://localhost:3000/';

  before(function(){
    casper.start(host);
  });

  it('should display a form', function() {
    casper.thenOpen(host + 'pp/event', function() {
      expect('#party-event-form').to.be.inDOM;
    });
  });

   it('should have input for party name, party playlist and date', function() {
    casper.thenOpen(host + 'pp/event', function() {
      expect('#party-event-form').to.include.text("Party name:")
      expect('#party-event-form').to.include.text("Party playlist name:")
      expect('#party-event-form').to.include.text("Date:")
    });
  });

});
