var partyPlannerModel = require('../models/partyPlannerModel');

exports.authorize = function(req, res) {
  partyPlannerModel.authorizeSpotify(req, res);
};

exports.authorizeCallback = function(req, res) {
  partyPlannerModel.authorizeSpotifyCallback(req, res);
};
