var mobileAppModel = require('../models/mobileAppModel');

exports.getBeacon = function(req, res) {
  var pgEmail = req.param('email');
  mobileAppGetBeaconModel.startSearchFromEmail(pgEmail, res);
};

exports.songs = function(req, res) {
  mobileAppModel.songs(req, res);
};
