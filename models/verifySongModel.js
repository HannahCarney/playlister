var helpersDatabase = require('./helpersDatabase');

exports.verifySongChoices = function(ppPartyName, ppPartyDate, singleSongChoice,callback){
  var collectionName = 'pgSongChoice';
  var matcher = {ppPartyName: ppPartyName, ppPartyDate: ppPartyDate};
  var fields = {pgSongChoice: 1};
  helpersDatabase.readFromDatabaseNoLimits(collectionName,matcher,fields,function(err,doc){
      helpersDatabase.errorHandling(err);
      var docArray = [];
      for (var i = 0; i < doc.length; i++) {
        docArray.push(doc[i].pgSongChoice);
        };
      var flattenedArray = docArray.reduce(function(a,b) {
        return a.concat(b);
      });
      console.log(flattenedArray);
      callback(flattenedArray);
  });
};
