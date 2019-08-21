var express = require('express');
var router = express.Router();

let management = require('../controllers/management/management')

/* GET home page. */
router.get('/', management.get_test);

// First download from of tcp connection
router.get('/tcp', management.receive_data_stream);

// SSH manipulation
router.get('/stop_download/ip_address/:ip_address', management.stop_tag_download_csv);
router.get('/check_running_status/ip_address/:ip_address', management.get_running_status);

// Scan for network
router.get('/scan_network', management.scan_network);

module.exports = router; 
