var express = require('express');
var router = express.Router();

let management = require('../controllers/management/management')

/* GET home page. */
router.get('/', management.render_page);

// Scan for network
router.get('/scan_network', management.scan_network);

// Ping an IP address to see if it is within reach
router.get('/ping/ip_address/:ip_address', management.ping_ip_address);

// Stoping the localization script and downloading the .csv files
router.get('/start_script/ip_address/:ip_address/mode/:mode', management.start_script);

// Stoping the localization script and downloading the .csv files
router.get('/stop_download/ip_address/:ip_address', management.stop_tag_download_csv);

// Check running status of the script of an ip address
router.get('/check_script_status/ip_address/:ip_address', management.get_script_status);

module.exports = router; 
