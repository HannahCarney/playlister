var express = require('express');
var router = express.Router();
var verifySongController = require('../controllers/verifySongController');

router.get('/', verifySongController.topLevelVerify);

module.exports = router;
