var Client = require('ssh2').Client;
var color = require('colors');

var output_parser = require('./interpreter_output')

var dir = require('../../../configuration/directories')

module.exports.get_csv_list = function (req, res, ssh_client) {
    let commands = ['cd ~/clamour_data/csv_buffer', 'ls *.csv']
    var csv_list = [];
    
    ssh_client.shell(function (err, stream) {
        // Error handling
        if (err) {
            console.log(`SSH Client on tag ${req.params.ip_address} :: An error occured while trying start a shell command line :\n${err}`.red);
            return;
        }

        // Bash commands sent to the tag
        stream.end(commands.join('\n').concat(`\nexit\n`), function () {
            console.log(`SSH Client on tag ${req.params.ip_address} :: End of the shell session`.magenta);
        });

        // Error handling
        stream.on('error', function (err) {
            console.log(`SSH Client on tag ${req.params.ip_address} :: An error occured at the shell session\n${err}`.red);
            return;
        });

        // Searching for the csv names within the commands
        stream.on('data', function (data) {
            if (output_parser.found_csv_name(data.toString())){
                csv_list.push(output_parser.get_csv_names(data.toString()));
            }
        });

        // End of the Shell session and end of the ssh client
        stream.on('close', function () {
            console.log(`SSH Client on tag ${req.params.ip_address} :: List of CSV files :\n${csv_list}`.magenta);
            console.log(`SSH Client on tag ${req.params.ip_address} :: End of the shell session`.magenta);
            ssh_client.end();
        });
    });
}


