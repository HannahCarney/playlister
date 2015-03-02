var mobileAppModel = require('../models/mobileAppModel');

exports.getBeacon = function(req, res) {
  mobileAppModel.getBeacon(req, res);
};

exports.songs = function(req, res) {
  mobileAppModel.songs(req, res);
};
