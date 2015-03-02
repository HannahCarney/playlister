// describe('party planner user set up page', function() {

// var host = 'http://localhost:3000/';

//   before(function(){
//     casper.start(host);
//   });

//   it('should ask for registering beacons', function(){
//     casper.thenOpen(host + 'partyplanner/beacon/username', function() {
//       expect('body').to.include.text('Please register your party beacon');
//     });
//   });

//   it('should have a form to capture beacon details', function(){
//     casper.thenOpen(host + 'partyplanner/beacon/username', function() {
//       expect('form').to.include.text('Beacon (major)');
//       expect('form').to.include.text('Beacon (minor)');
//     });
//   });

//   context('not entering beacons numbers', function() {
    
//     it('should not allow the user to go further', function() {
//       casper.thenOpen(host + 'partyplanner/beacon/username', function() {
//         casper.then(function() {
//             this.mouse.click('#save');
//             this.waitForSelector('#party-event-form', function() {
//           });
//             expect('#minor').to.be.inDOM;
//         });
//       });
//     });

//   });
// });
