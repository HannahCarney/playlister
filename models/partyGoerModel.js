var helpers = require('./helpers');


// functions called by the controllers
exports.saveSongChoices = function(req, res) {
  var db = req.db;
  var collectionName = 'partyGoerSongChoice';
  var collectionObject = {"ppPartyName" : req.body.ppPartyName,
                          "ppPartyDate" : req.body.ppPartyDate,
                          "pgEmail" : req.body.email,
                          "pgSongChoice" : req.body.selectedSong
                          };
  helpers.saveToDatabase(db,
                        collectionName,
                        collectionObject);
  renderThankYouPage(req, res);
};


// helper functions
var renderThankYouPage = function(req, res){
  res.render('partyGoer/thankYou', {email: req.body.email,
                                song: req.body.selectedSong,
                                ppPartyName : req.body.ppPartyName,
                                ppPartyDate : req.body.ppPartyDate,
                                });
};
