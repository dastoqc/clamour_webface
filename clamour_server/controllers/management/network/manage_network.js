var nmap = require('node-nmap');
var colors = require("colors");
var ip_handler = require('./ip_adress_handler');
var network = require('../../../configuration/network.json');

// Settings
nmap.nmapLocation = "nmap"; //default

// Network control methods
module.exports.scan_for_tag_ip_address = function () {
    var promise = new Promise(async function (resolve, reject) {
        // Fetching the ip address from configuration file if it exists or self wlan otherwise
        var ip_address = (network.local_network || await ip_handler.get_self_wlan_ip_address());
        
        // Scan on local network
        console.log(`Network scan ongoing for ${ip_address}/24 ...`.cyan);
        var quickscan = new nmap.QuickScan(ip_address + '/24');
        quickscan.startScan();

        // Once the scan is complete, 
        quickscan.on('complete', async function (data) {
            try {
                // Filtering to keep only the IP addresses of devices in the database
                var tag_ip_addresses = await ip_handler.get_ip_addresses_from_scan(data);
                tag_ip_addresses = await ip_handler.filter_known_tags_ip_addresses(tag_ip_addresses);
                console.log(`Tag ip addresses detected on the network : ${tag_ip_addresses}`.cyan);
                resolve(tag_ip_addresses);
            } catch (err) {
                console.log(`Error while scanning the ip addresses:\n${err}`.red);
                reject(err);
            }
        });

        // Error handling
        quickscan.on('error', function (err) {
            console.log(`An error occured while trying to scan the network :\n${err}`);
        });
    })
    return promise;
};