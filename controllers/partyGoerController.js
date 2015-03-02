var partyGoerModel = require('../models/partyGoerModel');


exports.getSongs = function(req, res){
  var ppPartyName = req.params.partyName;
  var ppPartyDate = req.params.partyDate;
  var errorID = req.query.error;
  res.render('partyGoer/getSongs', {ppPartyName: ppPartyName,
      ppPartyDate: ppPartyDate, errorID: errorID});
};

exports.postSongs = function(req, res){
  // partyGoerModel.saveSongChoices(req, res);
  partyGoerModel.verifySongChoices(req, res);
};
