var express = require('express');
var router = express.Router();

let management = require('../controllers/management/management')
/* GET home page. */
router.get('/', management.get_test);

// First implementation of ssh connection
router.get('/ssh', management.get_ssh_csv);

// First download from of sftp connection
router.get('/sftp', management.download_csv);

module.exports = router; 
