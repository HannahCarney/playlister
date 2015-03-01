var mobileAppModel = require('../models/mobileAppModel');

exports.getBeacon = function(req, res) {
  mobileAppModel.getBeacon(req, res);
};

exports.addSongs = function(req, res) {
  mobileAppModel.addSongs(req, res);
};
