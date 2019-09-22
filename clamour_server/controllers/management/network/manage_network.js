var nmap = require('node-nmap');
var colors = require("colors");
var ip_handler = require('./ip_adress_handler');
var network = require('../../../configuration/network.json');

// Settings
nmap.nmapLocation = "nmap"; //default

// Network scan methods
module.exports.scan_for_tag_ip_address = function () {
    var promise = new Promise(async function (resolve, reject) {
        // Fetching the ip address from configuration file if it exists or self wlan otherwise
        var ip_address = network.local_network;

        // Scan on local network
        console.log(`Network scan ongoing for ${ip_address}/24 ...`.cyan);
        var quickscan = new nmap.QuickScan(ip_address + '/24');
        quickscan.scanTimeout = 60;
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
            console.log(`An error occured while trying to scan the network :\n${err}`.red);
        });
    })
    return promise;
};

// Ping specific IP address
module.exports.ping_ip_address = function (ip_address) {
    var promise = new Promise(async function (resolve, reject) {
        // Making sure the IP address if within the local network to not make an nmap of an unreachable network
        if (ip_handler.is_within_local_network(ip_address)) {
            // Scan on local network
            console.log(`Ping on the IP address ${ip_address} ...`.cyan);
            var quickscan = new nmap.QuickScan(ip_address);
            quickscan.startScan();
        } else {
            reject(`The IP address ${ip_address} not within the network, thus the ping cannot be performed`);
            return;
        }

        // Once the ping is attempted 
        quickscan.on('complete', async function (data) {
            try {
                // Filtering to keep only the IP addresses of devices in the database
                if (data[0]) {
                    console.log(`IP addresses ${ip_address} detected on the network`.cyan);
                    resolve(true);
                } else {
                    console.log(`IP addresses ${ip_address} not detected on the network`.cyan);
                    resolve(false);
                }
            } catch (err) {
                console.log(`Error while performing a ping on the IP address ${ip_address}:\n${err}`.red);
                reject(err);
            }
        });

        // Error handling
        quickscan.on('error', function (err) {
            console.log(`An error occured while trying to ping the IP address ${ip_address} :\n${err}`.red);
        });
    })
    return promise;
};