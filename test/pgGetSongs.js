// describe('party goer enters songs', function(){

//   var host = 'http://localhost:3000/';

//   before(function(){
//     casper.start(host);
//   });

//   it('should have a title', function(){
//     casper.thenOpen(host + 'partygoer/getsongs/birthday/2015-04-05', function(){
//       expect('body').to.include.text("Please enter your song choices for ")
//     });
//   });

//   it('should have an email field', function(){
//     casper.thenOpen(host + 'partygoer/getsongs/birthday/2015-04-05', function(){
//       expect('#party-email-form').to.be.inDOM;
//     });
//   });

//   it('should say Search for a Track', function() {
//     casper.thenOpen(host + 'partygoer/getsongs/birthday/2015-04-05', function(){
//       expect('body').to.include.text("Search for a Track");
//     });   
//   });


//   it('should have a search button', function(){
//     casper.thenOpen(host + 'partygoer/getsongs/birthday/2015-04-05', function(){
//       expect('#song-choices').to.be.inDOM;
//     });
//   });

// });
