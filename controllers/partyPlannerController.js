var partyPlannerModel = require('../models/partyPlannerModel');

exports.authorize = function(req, res) {
  partyPlannerModel.authorizeSpotify(req, res);
};

exports.authorizeCallback = function(req, res) {
  partyPlannerModel.authorizeSpotifyCallback(req, res);
};

exports.beacon = function(req, res) {
  res.render('partyPlanner/beacon');
};

exports.saveBeacon = function(req, res) {
  partyPlannerModel.saveBeacon(req, res);
};
