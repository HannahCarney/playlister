var helpersDatabase = require('./helpersDatabase');

// functions called by the controllers
exports.verifySongChoices = function(ppPartyName, ppPartyDate, pgSongChoice){
  var collectionName = 'pgSongChoice';
  var matcher = {ppPartyName: ppPartyName, ppPartyDate: ppPartyDate,
                pgSongChoice: selectedSong};
  var fields = {_id: 1}
  helpersDatabase.readFromDatabase(collectionName,matcher,fields,function(err,doc){
      helpersDatabase.errorHandling(err);
      if (doc.length > 0) {
        return false;
      }else{
        return true;
      }
  });
};

exports.saveSongChoices = function(ppPartyName, ppPartyDate, pgEmail, pgSongChoice) {
  var collectionName = 'pgSongChoice';
  var collectionObject = {"ppPartyName" : ppPartyName,
                          "ppPartyDate" : ppPartyDate,
                          "pgEmail" : pgEmail,
                          "pgSongChoice" : pgSongChoice};
  helpersDatabase.saveToDatabase(collectionName, collectionObject);
};
