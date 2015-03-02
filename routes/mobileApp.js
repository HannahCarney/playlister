var express = require('express');
var router = express.Router();
var mobileAppController = require('../controllers/mobileAppController');

router.get('/getbeacon', mobileAppController.getBeacon);

router.get('/songs', mobileAppController.songs);

// router.get('/removesongs/', mobileAppController.removeSongs);

module.exports = router;
