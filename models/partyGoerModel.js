var helpersDatabase = require('./helpersDatabase');

exports.saveSongChoices = function(ppPartyName, ppPartyDate, pgEmail, pgSongChoice) {
  var collectionName = 'pgSongChoice';
  var collectionObject = {"ppPartyName" : ppPartyName,
                          "ppPartyDate" : ppPartyDate,
                          "pgEmail" : pgEmail,
                          "pgSongChoice" : pgSongChoice};
  helpersDatabase.saveToDatabase(collectionName, collectionObject);
};
