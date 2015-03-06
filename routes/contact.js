var express = require('express');
var router = express.Router();
var contactController = require('../controllers/contactController');

router.get('/', contactController.contact);

module.exports = router;
