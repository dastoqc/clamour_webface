var Client = require('ssh2').Client;
var color = require('colors');
var path = require('path');

var output_parser = require('./interpreter_output')

var dir = require('../../../configuration/directories')

module.exports.get_csv_file_names = function (req, res, ssh_client) {
    var promise = new Promise(function (resolve, reject) {
        let commands = ['cd ~/clamour_data/csv_buffer', 'ls *.csv']
        var csv_list = [];

        ssh_client.shell(function (err, stream) {
            // Error handling
            if (err) {
                console.log(`SSH Client on tag ${req.params.ip_address} :: Error in shell session while trying to list csv files :\n${err}`.red);
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
                resolve(csv_list);
            });
        });
    })
    return promise;
}

module.exports.download_csv = function (req, res, ssh_client, csv_list) {
    // Setting a SFTP client to download the csv files
    var promise = new Promise(function (resolve, reject) {
        ssh_client.sftp(function (err, sftp_client) {
            // Error handling
            if (err) {
                console.log(`SSH Client on tag ${req.params.ip_address} :: Error while trying start a sftp client to download csv files :\n ${err}`.red);
                return;
            }
            // Downloading each csv file
            var response = [];
            csv_list.forEach(function (element) {
                sftp_client.fastGet(path.join(dir.remote_path.csv_buffer, element), path.join(dir.local_path.csv_buffer, element), function (err) {
                    if (err) {
                        console.log(`SFTP Client on tag ${req.params.ip_address} :: Error while trying to download ${element} :\n ${err}`.red);
                        return;
                    }
                    response.push(element);
                    console.log("0. EXCECUTED".bgWhite);
                    console.log(`SFTP Client on tag ${req.params.ip_address} :: ${element} downloaded`.cyan);
                    return;
                    if (response.length === csv_list.length) {
                        console.log("00. EXCECUTED".bgWhite);
                        return;
                    }
                });
                console.log("1. EXCECUTED".bgWhite);
            });
            console.log("2. EXCECUTED".bgWhite);
        });
        console.log("3. EXCECUTED".bgWhite);
    });
    console.log("4. EXCECUTED".bgWhite);
    return promise;
}

// delete_remote_csv = function (req, res, ssh_client, csv_list) {
//     let commands = ['cd ~/clamour_data/csv_buffer', 'rm *.csv']

//     ssh_client.shell(function (err, stream) {
//         // Error handling
//         if (err) {
//             console.log(`SSH Client on tag ${req.params.ip_address} :: An error occured while trying start a shell command line :\n${err}`.red);
//             return;
//         }

//         // Bash commands sent to the tag
//         stream.end(commands.join('\n').concat(`\nexit\n`), function () {
//             console.log(`SSH Client on tag ${req.params.ip_address} :: Shell commands sent to delete specified .csv files`.magenta);
//         });

//         // Error handling
//         stream.on('error', function (err) {
//             console.log(`SSH Client on tag ${req.params.ip_address} :: Error in shell session while trying to erase csv files\n${err}`.red);
//             return;
//         });

//         // End of the Shell session and end of the ssh client
//         stream.on('close', function () {
//             console.log(`SSH Client on tag ${req.params.ip_address} :: List of CSV files deleted :\n${csv_list}`.magenta);
//             console.log(`SSH Client on tag ${req.params.ip_address} :: End of the shell session`.magenta);
//             ssh_client.end();
//         });
//     });
// }