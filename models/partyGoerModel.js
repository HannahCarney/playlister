var helpersDatabase = require('./helpersDatabase');

// functions called by the controllers
exports.verifySongChoices = function(ppPartyName, ppPartyDate, singleSongChoice){
  var collectionName = 'pgSongChoice';
  var matcher = {ppPartyName: ppPartyName, ppPartyDate: ppPartyDate};
  var fields = {pgSongChoice: 1};
  var result;
  helpersDatabase.readFromDatabase(collectionName,matcher,fields,function(err,doc){
      helpersDatabase.errorHandling(err);
      var docArray = [];
      for (var i = 0; i < doc.length; i++) {
        docArray.push(doc[i].pgSongChoice);
        };
      var flattenedArray = docArray.reduce(function(a,b) {
        return a.concat(b);
      });
      result = flattenedArray.indexOf(singleSongChoice) > -1;
  });
  return result;
};

exports.saveSongChoices = function(ppPartyName, ppPartyDate, pgEmail, pgSongChoice) {
  var collectionName = 'pgSongChoice';
  var collectionObject = {"ppPartyName" : ppPartyName,
                          "ppPartyDate" : ppPartyDate,
                          "pgEmail" : pgEmail,
                          "pgSongChoice" : pgSongChoice};
  helpersDatabase.saveToDatabase(collectionName, collectionObject);
};
