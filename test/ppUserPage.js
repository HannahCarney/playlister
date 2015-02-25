describe('party planner user set up page', function() {

var host = 'http://localhost:3000/';

  before(function(){
    casper.start(host);
  });

  it('should say please set up your user account', function(){
    casper.thenOpen(host + 'pp/user', function() {
      expect('body').to.include.text('Please set up your user account');
    });
  });

  it('should have a form to capture user details', function(){
    casper.thenOpen(host + 'pp/user', function() {
      expect('form').to.include.text('Beacon (major)');
      expect('form').to.include.text('Beacon (minor)');
      expect('form').to.include.text('Username');
    });
  });

  it('should have a form for user details', function() {
    casper.thenOpen(host + 'pp/user', function() {
      expect('#user-details-form').to.be.inDOM;
    });
  });

});
