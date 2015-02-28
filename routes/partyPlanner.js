var express = require('express');
var router = express.Router();
var partyPlannerController = require('../controllers/partyPlannerController');


router.get('/authorize', partyPlannerController.authorize);

router.get('/authorize/callback', partyPlannerController.authorizeCallback);

router.get('/beacon', partyPlannerController.beacon);

router.post('/beacon', partyPlannerController.saveBeacon);

router.get('/eventdetails', partyPlannerController.eventDetails);


module.exports = router;
