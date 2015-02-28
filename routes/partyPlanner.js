var express = require('express');
var router = express.Router();
var partyPlannerController = require('../controllers/partyPlannerController');


router.get('/authorize', partyPlannerController.authorize);

router.get('/authorize/callback', partyPlannerController.authorizeCallback);

router.get('/beacon', partyPlannerController.beacon);

router.post('/beacon', partyPlannerController.saveBeacon);

router.get('/eventdetails', partyPlannerController.eventDetails);

router.post('/eventdetails', partyPlannerController.saveEventDetails);

router.get('/completed/:partyName/:partyDate/:playlistName', partyPlannerController.completed);


module.exports = router;
