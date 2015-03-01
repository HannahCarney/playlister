var express = require('express');
var router = express.Router();
var partyGoerController = require('../controllers/partyGoerController');

router.get('/getsongs/:partyName/:partyDate', partyGoerController.getSongs);

router.post('/getsongs', partyGoerController.postSongs);

module.exports = router;
