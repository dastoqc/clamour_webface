var nmap = require('node-nmap');
var ip_handler = require('./ip_adress_handler');
var colors = require("colors");

// Settings
nmap.nmapLocation = "nmap"; //default

// Network control methods
module.exports.scan_for_tag_ip_address = function () {
    var promise = new Promise(async function (resolve, reject) {
        console.log(`Network scan ongoing`.cyan);
        var quickscan = new nmap.QuickScan(await ip_handler.get_self_wlan_ip_address() + '/24');
        quickscan.startScan();

        quickscan.on('complete', async function (data) {
            try {
                var tag_ip_addresses = await ip_handler.get_ip_addresses_from_scan(data);
                tag_ip_addresses = await ip_handler.filter_potential_tag_ip_addresses(tag_ip_addresses);
                tag_ip_addresses = await ip_handler.filter_known_tags_ip_addresses(tag_ip_addresses);
                console.log(`Tag ip addresses detected on the network : ${tag_ip_addresses}`.cyan);
                resolve(tag_ip_addresses);
            } catch (err) {
                console.log(`Error while scanning the ip addresses:\n${err}`.red);
                reject(err);
            }
        });

        quickscan.on('error', function (err) {
            console.log(`An error occured while trying to scan the network :\n${err}`);
        });
    })
    return promise;
};