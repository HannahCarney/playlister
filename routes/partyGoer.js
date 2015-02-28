var express = require('express');
var router = express.Router();
var partyGoerController = require('../controllers/partyGoerController');

router.get('/getsongs/:partyName/:partyDate', partyGoerController.getSongs);

router.post('/pg/getsongs', partyGoerController.postSongs);

module.exports = router;
