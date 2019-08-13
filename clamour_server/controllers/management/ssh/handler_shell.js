var Client = require('ssh2').Client;
var color = require('colors');
var path = require('path');

var output_parser = require('./interpreter_output')

var dir = require('../../../configuration/directories')

module.exports.get_csv_files = function (req, res, ssh_client) {
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
            console.log(`SSH Client on tag ${req.params.ip_address} :: Shell commands sent to get .csv list`.magenta);
        });

        // Error handling
        stream.on('error', function (err) {
            console.log(`SSH Client on tag ${req.params.ip_address} :: An error occured at the shell session\n${err}`.red);
            return;
        });

        // Searching for the csv names within the commands
        stream.on('data', function (data) {
            if (output_parser.found_csv_name(data.toString())) {
                csv_list = csv_list.concat(output_parser.get_csv_names(data.toString()));
            }
        });

        // End of the Shell session and end of the ssh client
        stream.on('close', function () {
            console.log(`SSH Client on tag ${req.params.ip_address} :: List of CSV files :\n${csv_list}`.magenta);
            console.log(`SSH Client on tag ${req.params.ip_address} :: End of the shell session`.magenta);
            download_csv(req, res, ssh_client, csv_list);
        });
    });
}

download_csv = function (req, res, ssh_client, csv_list) {
    // Setting a SFTP client to download the csv files
    ssh_client.sftp(function (err, sftp_client) {
        // Error handling
        if (err) {
            console.log(`SSH Client on tag ${req.params.ip_address} :: Error while trying start a sftp client to download csv files :\n ${err}`.red);
            return;
        }
        // Downloading each csv file
        var response = [];
        csv_list.forEach(function (element, index) {
            sftp_client.fastGet(path.join(dir.remote_path.csv_buffer, element), path.join(dir.local_path.csv_buffer, element), function (err) {
                    if (err) {
                        console.log(`SFTP Client on tag ${req.params.ip_address} :: Error while trying to download ${element} :\n ${err}`.red);
                        ssh_client.end();
                        return;
                    }
                    response.push(index);
                    console.log(`SFTP Client on tag ${req.params.ip_address} :: ${element} downloaded`.cyan);
                    if(response.length  === csv_list.length) {
                        ssh_client.end();
                    }
                });
        });
    });
    
}


