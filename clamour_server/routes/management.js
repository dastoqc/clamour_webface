var express = require('express');
var router = express.Router();

let management = require('../controllers/management/management')

/* GET home page. */
router.get('/', management.get_test);

// First implementation of ssh connection
router.get('/ssh', management.get_ssh_csv);

// First download from of sftp connection
router.get('/sftp', management.download_csv);

// First download from of tcp connection
router.get('/tcp', management.receive_data_stream);

// First download from of tcp connection
router.get('/network', management.scan_network);



// SSH manipulation
router.get('/csv_list/ip_address/:ip_address', management.get_ssh_csv);

module.exports = router; 
