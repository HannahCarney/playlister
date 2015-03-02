var helpersDatabase = require('./helpersDatabase');



 // functions called by the controllers

exports.verifySongChoice = function(req,res){
  var db = req.db;
  var collectionName = 'pgSongChoice';
  var matcher = {ppPartyName: req.body.ppPartyName, ppPartyDate: req.body.ppPartyDate, 
                pgSongChoice: req.body.selectedSong};

  helpersDatabase.readFromDatabase(db,collectionName,matcher,{_id: 1},function(err,doc){
      helpersDatabase.errorHandling(err);
      if (doc.count() > 0) {
        console.log("Already on the list!");
        res.redirect('getsongs/'+ppPartyName+'/'+ppPartyDate,{error: "This song has been already selected for the party."});
      }else{
         saveSongChoices(req,res);
      }
  });
}

exports.saveSongChoices = function(req, res) {
  var db = req.db;
  var collectionName = 'pgSongChoice';
  var collectionObject = {"ppPartyName" : req.body.ppPartyName,
                          "ppPartyDate" : req.body.ppPartyDate,
                          "pgEmail" : req.body.email,
                          "pgSongChoice" : req.body.selectedSong
                          };
  helpersDatabase.saveToDatabase(db, collectionName, collectionObject);
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
