var Client = require('ssh2').Client;
var color = require('colors');

var ssh = require('./client_ssh');

var con = require('../../../configuration/default_ssh.json')

// Methods accessible outside 
module.exports.download_all_csv = function (req, res) {

    var promise = new Promise(async function (resolve, reject) {
        try {
            var client = await connect_with_tag(req);
            var csv_list = await ssh.list_csv(req, res, client);
            if (csv_list.length !== 0) {
                var downloaded = await ssh.download_csv(req, res, client, csv_list);
                await ssh.delete_csv(req, res, client, downloaded);
            }
            resolve(downloaded);
            await disconnect_from_tag(client);

        } catch (err) {
            console.log(`Error while trying to download a list of csv files :`.red);
            reject(err);
            await disconnect_from_tag(client);
        }
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
            console.log(`Error while trying to get the running status of ip address ${ip_address} :`.red);
            reject(err);
        }
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
    })
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
            reject();
        }
    })
    return promise;
}