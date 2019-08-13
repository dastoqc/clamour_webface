var Client = require('ssh2').Client;
var color = require('colors');

var shell_handler = require('./handler_shell');

var con = require('../../../configuration/default_ssh.json')

// Methods accessible outside 
module.exports.list_csv_in_tag = function (req, res) {
    interract_with_tag(req, res, shell_handler.get_csv_list)
}

// Internal function
const interract_with_tag = function (req, res, shell_function) {
    // Variable declaration
    var ssh_client = new Client();

    try {
        ssh_client.connect({
            host: "192.168.4.1",
            port: 22,
            username: 'pi',
            password: '!clamour'
        });
    } catch (error) {
        console.log("An error occured during the ssh connection attempt".red);
        console.log(error);
        return;
    }

    // Error handling
    ssh_client.on('error', function (err) {
        console.log(`An error occured in the SSH connection with tag ${req.params.ip_address}`.red);
        console.log(`Level: ${err.level} \n${err.stack}`.red)
        return;
    });

    // End of communication
    ssh_client.on('end', function () {
        console.log(`SSH Client :: End of SSH communication with tag ${req.params.ip_address}`.yellow);
    });

    // Actions to take upon the start of the connection
    ssh_client.on('ready', function () {
        shell_function(req, res, ssh_client)
    });
}