describe('party planner user set up page', function() {

var host = 'http://localhost:3000/';

  before(function(){
    casper.start(host);
  });

  it('should ask for registering beacons', function(){
    casper.thenOpen(host + 'partyplanner/beacon/username', function() {
      expect('body').to.include.text('Please register your party beacon');
    });
  });

  it('should have a form to capture beacon details', function(){
    casper.thenOpen(host + 'partyplanner/beacon/username', function() {
      expect('form').to.include.text('Beacon (major)');
      expect('form').to.include.text('Beacon (minor)');
    });
  });

});
