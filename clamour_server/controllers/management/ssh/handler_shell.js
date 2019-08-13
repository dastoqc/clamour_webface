var Client = require('ssh2').Client;
var color = require('colors');
var path = require('path');

var output_parser = require('./interpreter_output')

var dir = require('../../../configuration/directories')


module.exports.get_csv_list = function (req, res, ssh_client) {
    // Bash commands to get the list of csv files
    let commands = ['cd ~/clamour_data/csv_buffer', 'ls *.csv']

    // Function used on the data outputed
    dataFunction = function (req, res, data, static_data) {
        if(!static_data){
            static_data = [];
        }
        if (output_parser.found_csv_name(data.toString())){
            static_data.push(output_parser.get_csv_names(data.toString()));
            console.log(`${static_data}`.cyan);
        }
    };

    // Function used at the end of the shell session
    closeFunction = function (req, res, static_data) {
        console.log(`Looks like it worked : ${static_data}`.magenta);
    };

    // Function to deploy the defined behavior in the shell command line
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
            console.log(`SSH Client :: End of the ssh connection on the tag ${req.params.ip_address}`.magenta);
            ssh_client.end();
        });
    });
}


