var nmap = require('node-nmap');
var ip_handler = require('./ip_adress_handler');
var colors = require("colors");

// Settings
nmap.nmapLocation = "nmap"; //default

// Network control methods
module.exports.scan_for_tag_ip_address = async function(req, res, next) {
    
    var quickscan = new nmap.QuickScan(ip_handler.get_self_wlan_ip_address() + '/24');
    quickscan.startScan();

    quickscan.on('complete', function (data) {
        var ip_addresses = ip_handler.get_ip_addresses_from_scan(data);
        var tag_ip_addresses = ip_handler.filter_ip_addresses_from_list(ip_addresses);
        console.log(`List ip addresses detected on the network : ${tag_ip_addresses}`);
    });
    
    quickscan.on('error', function(err){
        console.log(`An error occured while trying to scan the network :\n${err}`);
    });
};