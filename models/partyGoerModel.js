
// functions called by the controllers
exports.saveSongChoices = function(req, res) {
  var db = req.db;
  var collection = db.get('partyGoerSongChoice');
  collection.insert({
    "ppPartyName" : req.body.ppPartyName,
    "ppPartyDate" : req.body.ppPartyDate,
    "pgEmail" : req.body.email,
    "pgSongChoice" : req.body.selectedSong
  }, function(err, doc) {
    if (err) {
      console.log("FAILED: Party Goer Song Choice write to db");
    }
    else {
      console.log("SUCCESS: Party Goer Song Choice write to db");
      renderThankYouPage(req, res);
    }
  });
};


// helper functions
var renderThankYouPage = function(req, res){
  res.render('partyGoer/thankYou', {email: req.body.email,
                                song: req.body.selectedSong,
                                ppPartyName : req.body.ppPartyName,
                                ppPartyDate : req.body.ppPartyDate,
                                });
};
