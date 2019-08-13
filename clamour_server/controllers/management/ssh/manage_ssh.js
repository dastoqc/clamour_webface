var Client = require('ssh2').Client;
var color = require('colors');

var shell_handler = require('./handler_shell');

var con = require('../../../configuration/default_ssh.json')

// Methods accessible outside 
module.exports.list_csv_in_tag = function (req, res) {

    interract_with_tag(req, res, shell_handler.get_csv_list)
}

// Internal function
const interract_with_tag = function (req, res, shell_function_array) {
    // Variable declaration
    var ssh_client = new Client();

    try {
        ssh_client.connect({
            host: req.params.ip_address,
            port: 22,
            username: 'pi',
            password: '!clamour'
        });
    } catch (error) {
        console.log(`An error occured during the SSH connection attempt on ip address ${req.params.ip_address}`.red);
        console.log(error);
        return;
    }

    // Error handling
    ssh_client.on('error', function (err) {
        console.log(`SSH Client on tag ${req.params.ip_address} :: An error occured in the SSH connection with tag ${req.params.ip_address}`.red);
        console.log(`Level: ${err.level} \n${err.stack}`.red)
        return;
    });

    // End of communication
    ssh_client.on('end', function () {
        console.log(`SSH Client on tag ${req.params.ip_address} :: End of SSH communication with tag`.yellow);
    });

    // Actions to take upon the start of the connection
    ssh_client.on('ready', function () {
        console.log(`SSH Client on tag ${req.params.ip_address} :: Start of SSH communication with tag`.green);
        shell_function_array(req, res, ssh_client)
    });
}