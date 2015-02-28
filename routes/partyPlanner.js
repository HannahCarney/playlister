var express = require('express');
var router = express.Router();
var partyPlannerController = require('../controllers/partyPlannerController');



router.get('/authorize', partyPlannerController.authorize);

router.get('/authorize/callback', partyPlannerController.authorizeCallback);

module.exports = router;
