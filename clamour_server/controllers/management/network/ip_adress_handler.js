var nmap = require('node-nmap');
var os = require('os');
var db = require('../../database/database');

// Settings
var ifaces = os.networkInterfaces();

// Get the first wlan IP address
module.exports.get_self_wlan_ip_address = async function () {
    var wlan_interface_name;
    for (var iface in ifaces) {
        if (/^wl/.test(iface))
            wlan_interface_name = iface;
    }
    return ifaces[wlan_interface_name][0].address;
};

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