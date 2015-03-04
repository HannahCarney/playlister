var partyGoerModel = require('../models/partyGoerModel');


exports.getSongs = function(req, res){
  var ppPartyName = req.params.partyName;
  var ppPartyDate = req.params.partyDate;
  var errorID = req.query.error;
  res.render('partyGoer/getSongs', {ppPartyName: ppPartyName,
      ppPartyDate: ppPartyDate, errorID: errorID});
};

exports.postSongs = function(req, res){
  var ppPartyName = req.body.ppPartyName;
  var ppPartyDate = req.body.ppPartyDate;
  var pgEmail = req.body.email;
  var pgSongChoice = req.body.selectedSong.split(",");
  partyGoerModel.saveSongChoices(ppPartyName, ppPartyDate, pgEmail, pgSongChoice);
  if (partyGoerModel.verifySongChoices(ppPartyName, ppPartyDate, pgSongChoice) === false) {
    res.redirect('/partygoer/getsongs/'+ppPartyName+'/'+ppPartyDate+"?error=1");
  } else {
    res.render('partyGoer/thankYou', {email: pgEmail,
                                      ppPartyName : ppPartyName,
                                      ppPartyDate : ppPartyDate});
  }
};
