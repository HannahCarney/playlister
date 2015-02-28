var partyGoerModel = require('../models/partyGoerModel');


exports.getSongs = function(req, res){
  var ppPartyName = req.params.partyName;
  var ppPartyDate = req.params.partyDate;
  res.render('partyGoer/getSongs', {ppPartyName: ppPartyName, ppPartyDate: ppPartyDate});
};

exports.postSongs = function(req, res){
  partyGoerModel.saveSongChoices(req, res);
};
