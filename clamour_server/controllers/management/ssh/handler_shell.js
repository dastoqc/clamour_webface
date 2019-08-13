var Client = require('ssh2').Client;
var color = require('colors');
var path = require('path');

var from_output = require('./interpreter_output')

var dir = require('../../../configuration/directories')


module.exports.get_csv_list = function (req, res, ssh_client) {
    // Bash commands to get the list of csv files
    let commands = ['cd ~/clamour_data/csv_buffer', 'ls *.csv']

    // Function used on the data outputed
    dataFunction = function (req, res, data, static_data) {
        let csv_name_seeker = null;
        if (csv_name_seeker = from_output.find_csv_names(data.toString())){
            static_data = csv_name_seeker;
            console.log(`${static_data}`.cyan);
        }
    };

    // Function used at the end of the shell session
    closeFunction = function (req, res, static_data) {
        console.log(`Looks like it worked : ${static_data}`.magenta);
    };

    interract_with_shell(req, res, ssh_client, commands, dataFunction, closeFunction);
};

// Internal function
const interract_with_shell = function (req, res, ssh_client, commands, dataFunction, closeFunction) {
    var static_data;
    ssh_client.shell(function (err, stream) {
        if (err) {
            console.log(`An error occured while trying start a shell command line :\n ${err}`.red);
            return;
        }

        // Bash commands sent to the tag
        stream.end(commands.join('\n').concat(`\nexit\n`), function () {
            console.log(`SSH Client :: End of the shell session on the tag ${req.params.ip_address}`.magenta);
        });

        // Error handling
        stream.on('error', function (err) {
            console.log(`SSH Client :: An error occured at the shell session on the tag ${req.params.ip_address}`.red);
            console.log(`${err}`.red)
            return;
        });

        // Searching for the csv names within the commands
        stream.on('data', function (data) {
            dataFunction(req, res, data, static_data);
        });

        // End of the Shell session and end of the ssh client
        stream.on('close', function () {
            closeFunction(req, res, static_data);
            console.log(`SSH Client :: End of the ssh connection on the tag`.magenta);
            ssh_client.end();
        });
    });
}


