var nmap = require('node-nmap');
var os = require('os');
var db = require('../../database/database');
var network = require('../../../configuration/network.json');

// Take the result of the nmap scan and retreive only the list of IP addresses
module.exports.get_ip_addresses_from_scan = async function (scan_data) {
    var ip_addresses = [];
    for (var i = 0; i < scan_data.length; i++)
        ip_addresses.push(scan_data[i].ip);
    return ip_addresses;
};

// From a list of IP addresses, takes only the IP addresses that are known in the database
module.exports.filter_known_tags_ip_addresses = async function (ip_address_list) {
    var tag_ip_address = [];
    var promise = new Promise(async function (resolve, reject) {
        try {
            for (var i = 0; i < ip_address_list.length; i++) {
                if (await db.query.tags.found({ ip_address: ip_address_list[i] })) {
                    await tag_ip_address.push(ip_address_list[i]);
                };
            }
            resolve(tag_ip_address);
        } catch (err) {
            reject(err);
        }
    });
    return promise;
}

// Verifying if the ip address only differs from it's last value to see if it's within the local network
module.exports.is_within_local_network = function (param) {
    var reference = network.local_network.split('.');
    var ip_address = param.split('.');
    for (var i = 0; i < 3; i++) {
        if (reference[i] !== ip_address[i])
            return false
    }
    return true;
}