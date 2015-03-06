var verifySongModel = require('../models/verifySongModel');

exports.topLevelVerify = function(req, res) {
  var ppPartyDate = req.param('ppPartyDate');
  var ppPartyName = req.param('ppPartyName');
  var singleSongChoice = req.param('singleSongChoice');
  verifySongModel.verifySongChoices(ppPartyName, ppPartyDate, function(flattenedArray){
    if (flattenedArray.indexOf(singleSongChoice) > -1) {
      res.json({songChoiceAllowed: false});
    }
    else {
      res.json({songChoiceAllowed: true});
    }
  });
};
