var express = require('express');
var router = express.Router();

let management = require('../controllers/management')
/* GET home page. */
router.get('/', management.get_test);

module.exports = router; 
