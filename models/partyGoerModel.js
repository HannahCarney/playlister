var helpersDatabase = require('./helpersDatabase');

// functions called by the controllers
exports.verifySongChoices = function(ppPartyName, ppPartyDate, singleSongChoice,callback){
  var collectionName = 'pgSongChoice';
  var matcher = {ppPartyName: ppPartyName, ppPartyDate: ppPartyDate};
  var fields = {pgSongChoice: 1};
  var result;
  return helpersDatabase.readFromDatabaseNoLimits(collectionName,matcher,fields,function(err,doc){
      helpersDatabase.errorHandling(err);
    if (doc.length > 0) {
        res.redirect('/partygoer/getsongs/'+req.body.ppPartyName+'/'+req.body.ppPartyDate+"?error=1");
      var docArray = [];
      for (var i = 0; i < doc.length; i++) {
        docArray.push(doc[i].pgSongChoice);
        };
      var flattenedArray = docArray.reduce(function(a,b) {
        return a.concat(b);
      });
      console.log(flattenedArray);
      callback(flattenedArray);

      } else {
         saveSongChoices(req,res);
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
