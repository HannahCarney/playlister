describe('party planner event completed page', function() {

var host = 'http://localhost:3000/';

  before(function(){
    casper.start(host);
  });

  it('should show Thank you for entering your party information', function() {
    casper.thenOpen(host + 'pp/completed', function() {
      expect('body').to.include.text("Thank you for entering your party information");
    });
  });

  //  it('should have input for party name, party playlist and date', function() {
  //   casper.thenOpen(host + 'pp/event', function() {
  //     expect('#party-event-form').to.include.text("Party name:")
  //     expect('#party-event-form').to.include.text("Party playlist name:")
  //     expect('#party-event-form').to.include.text("Date:")
  //   });
  // });

});
