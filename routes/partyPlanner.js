var express = require('express');
var router = express.Router();
var partyPlannerController = require('../controllers/partyPlannerController');

router.get('/authorize', partyPlannerController.authorize);

router.get('/authorize/callback', partyPlannerController.authorizeCallback);

router.get('/beacon/:spotifyID', partyPlannerController.beacon);

router.post('/beacon/:spotifyID', partyPlannerController.saveBeacon);

router.get('/eventdetails/:spotifyID', partyPlannerController.eventDetails);

router.post('/eventdetails/:spotifyID', partyPlannerController.saveEventDetails);

router.get('/completed/:partyName/:partyDate/:playlistName', partyPlannerController.completed);


module.exports = router;
