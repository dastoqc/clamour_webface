var Client = require('ssh2').Client;
var color = require('colors');

var ssh = require('./client_ssh');

var con = require('../../../configuration/default_ssh.json')

// Methods accessible outside 
module.exports.start_script = function (ip_address, mode) {
    var promise = new Promise(async function (resolve, reject) {
        try {
            var client = await connect_with_tag(ip_address, mode);
            await ssh.start_script(client, ip_address, {mode: "test"});
            resolve();
        } catch (err) {
            console.log(`Error while trying to start the script on tag ${ip_address} :\n${err}`.red);
            reject(err);
        }
        await disconnect_from_tag(client);
    });
    return promise;
}


module.exports.stop_script = function (ip_address) {
    var promise = new Promise(async function (resolve, reject) {
        try {
            var client = await connect_with_tag(ip_address);
            await ssh.stop_script(client, ip_address);
            resolve();
        } catch (err) {
            console.log(`Error while trying to stop the script on tag ${ip_address} :\n${err}`.red);
            reject(err);
        }
        await disconnect_from_tag(client);
    });
    return promise;
}

module.exports.download_all_csv = function (ip_address) {
    var promise = new Promise(async function (resolve, reject) {
        try {
            var client = await connect_with_tag(ip_address);
            var csv_list = await ssh.list_csv(client, ip_address);
            if (csv_list.length !== 0) {
                var downloaded = await ssh.download_csv(client, ip_address, csv_list);
                await ssh.delete_csv(client, ip_address, downloaded);
                resolve(downloaded);
            }
            else {
                resolve([]);
            }
        } catch (err) {
            console.log(`Error while trying to download a list of csv files :`.red);
            reject(err);
        }
        await disconnect_from_tag(client);
    });
    return promise;
}

module.exports.check_running_status = async function (ip_address) {
    var promise = new Promise(async function (resolve, reject) {
        try {
            var client = await connect_with_tag(ip_address);
            var running_status = await ssh.get_running_status(client, ip_address);
            resolve(running_status);
        } catch (err) {
            console.log(`Error while trying to get the running status of tag on ip address ${ip_address} :`.red);
            reject(err);
        }
        await disconnect_from_tag(client);
    });
    return promise;
}

// Internal function
const connect_with_tag = function (ip_address) {
    var promise = new Promise(function (resolve, reject) {
        var ssh_client = new Client();
        try {
            ssh_client.connect({
                host: ip_address,
                port: 22,
                username: 'pi',
                password: '!clamour'
            });
        } catch (error) {
            console.log(`An error occured during the SSH connection attempt on ip address ${ip_address}`.red);
            console.log(error);
            return;
        }

        // Error handling
        ssh_client.on('error', function (err) {
            console.log(`SSH Client on tag ${ip_address} :: An error occured in the SSH connection with tag`.red);
            console.log(`Level: ${err.level} \n${err.stack}`.red)
            return;
        });

        // End of communication
        ssh_client.on('end', function () {
            console.log(`SSH Client on tag ${ip_address} :: End of SSH communication with tag`.yellow);
        });

        // Actions to take upon the start of the connection
        ssh_client.on('ready', function () {
            console.log(`SSH Client on tag ${ip_address} :: Start of SSH communication with tag`.green);
            resolve(ssh_client);
        });
    });
    return promise;
}

const disconnect_from_tag = function (ssh_client) {
    var promise = new Promise(function (resolve, reject) {
        try {
            ssh_client.end();
            resolve();
        } catch (err) {
            console.log(`An error occured during the SSH disconnection attempt on ip address ${ip_address}`.red);
            console.log(err);
            reject(err);
        }
    });
    return promise;
}