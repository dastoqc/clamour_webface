var nmap = require('node-nmap');
var os = require('os');

var db = require('../../database/database');

// Settings
var ifaces = os.networkInterfaces();

/**
 * Exported functions
 */
module.exports.get_self_wlan_ip_address = async function () {
    var wlan_interface_name;
    for (var iface in ifaces) {
        if (/^wl/.test(iface))
            wlan_interface_name = iface;
    }
    return ifaces[wlan_interface_name][0].address;
};

module.exports.get_ip_addresses_from_scan = async function (scan_data) {
    var ip_addresses = [];
    for (var i = 0; i < scan_data.length; i++)
        ip_addresses.push(scan_data[i].ip);
    return ip_addresses;
};

module.exports.filter_potential_tag_ip_addresses = async function (ip_address_list) {
    var ip_addresses_to_ignore = get_ip_addresses_to_ignore();
    var index;
    for (var i = 0; i < ip_addresses_to_ignore.length; i++) {
        index = ip_address_list.indexOf(ip_addresses_to_ignore[i]);
        if (index !== -1)
            ip_address_list.splice(ip_address_list.indexOf(ip_addresses_to_ignore[i]), 1);
    }
    return ip_address_list;
};

module.exports.filter_known_tags_ip_addresses = async function (ip_address_list) {

    var tag_ip_address = [];
    var counter = 0;
    var promise = new Promise(async function (resolve, reject) {
        try {
            for (var i = 0; i < ip_address_list.length; i++) {
                if (await db.query.tags.found(ip_address_list[i])) {
                    tag_ip_address.push(element);
                };
            }
            resolve(tag_ip_address);
        } catch (err) {
            reject(err);
        }
    });
    return promise;
}

/**
 * Internal functions
 */
get_ip_addresses_to_ignore = function () {
    var addresses_to_ignore = get_local_ip_addresses();
    return addresses_to_ignore.concat(get_router_ip_addresses(addresses_to_ignore));
};

get_router_ip_addresses = function (addresses) {
    var router_addresses_list = [];
    for (var i = 0; i < addresses.length; i++) {
        var router_address = addresses[i].split('.');
        if (router_address[3] != '1') {
            router_address[3] = '1';
            router_address = router_address.join('.');
            router_addresses_list.push(router_address);
        }
    }
    return router_addresses_list;
};

get_local_ip_addresses = function () {
    var local_addresses = [];
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            if ('IPv4' !== iface.family || iface.internal !== false) return;
            // Add the ipv4 addresses

            local_addresses.push(iface.address)
            ++alias;
        });
    });
    return local_addresses;
};