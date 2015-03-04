var mobileAppSongsModel = require('../models/mobileAppSongsModel');
var mobileAppGetBeaconModel = require('../models/mobileAppGetBeaconModel');

exports.getBeacon = function(req, res) {
  var pgEmail = req.param('email');
  mobileAppGetBeaconModel.startSearchFromEmail(pgEmail, res);
};

exports.songs = function(req, res) {
  var beaconMajor = req.param('beaconMajor');
  var beaconMinor = req.param('beaconMinor');
  var email = req.param('email');
  var action = req.param('action');
  mobileAppSongsModel.songs(res, beaconMinor, beaconMajor, email, action);
};
