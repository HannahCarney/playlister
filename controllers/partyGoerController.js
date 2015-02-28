
exports.getSongs = function(req, res){
  var ppPartyName = req.params.partyName;
  var ppPartyDate = req.params.partyDate;
  res.render('partyGoer/getSongs', {ppPartyName: ppPartyName, ppPartyDate: ppPartyDate});
};

exports.postSongs = function(req, res) {
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
    }
  });
  res.render('thankYou', {email: req.body.email, song: req.body.selectedSong,
                  ppPartyName : req.body.ppPartyName,
                  ppPartyDate : req.body.ppPartyDate,  });
};
