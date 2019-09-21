var Client = require('ssh2').Client;
var color = require('colors');
var path = require('path');

var output_parser = require('./interpreter_output');
var db = require('../../database/database');
var dir = require('../../../configuration/directories');

module.exports.list_csv = function (ssh_client, ip_address) {

    var promise = new Promise(function (resolve, reject) {
        let commands = ['cd ~/clamour_data/csv_buffer', 'ls *.csv']
        var csv_list = [];

        // Shell command line
        ssh_client.shell(function (err, stream) {
            if (err) {
                console.log(`SSH Client on tag ${ip_address} :: Error in shell session while trying to list csv files :\n${err}`.red);
                return;
            }

            // Bash commands sent to the tag
            stream.end(commands.join('\n').concat(`\nexit\n`), function () {
                console.log(`SSH Client on tag ${ip_address} :: Shell commands sent to get .csv list`.magenta);
            });

            // Error handling
            stream.on('error', function (err) {
                console.log(`SSH Client on tag ${ip_address} :: An error occured while trying to list csv files\n${err}`.red);
                return;
            });

            // Searching for the csv names within the commands
            stream.on('data', function (data) {
                if (output_parser.found_csv_name(data.toString())) {
                    csv_list = csv_list.concat(output_parser.get_csv_names(data.toString()));
                }
            });

            // End of the Shell session
            stream.on('close', function () {
                console.log(`SSH Client on tag ${ip_address} :: List of CSV files : ${csv_list}`.magenta);
                console.log(`SSH Client on tag ${ip_address} :: End of the shell session`.magenta);
                resolve(csv_list);
            });
        });
    })
    return promise;
}

module.exports.download_csv = function (ssh_client, ip_address, csv_list) {

    var promise = new Promise(function (resolve, reject) {
        // If the list of csv to download is empty, end the function directly
        if (csv_list.length === 0) {
            resolve([]);
        }

        // Setting a SFTP client to download the csv files
        ssh_client.sftp(function (err, sftp_client) {
            if (err) {
                console.log(`SSH Client on tag ${ip_address} :: Error while trying start a sftp client to download csv files :\n ${err}`.red);
                return;
            }

            // Downloading each csv file
            var attempted = [];
            var downloaded = [];
            csv_list.forEach(function (element) {
                sftp_client.fastGet(path.join(dir.remote_path.csv_buffer, element), path.join(dir.local_path.csv_buffer, element), function (err) {
                    attempted.push(element);
                    if (err) {
                        console.log(`SFTP Client on tag ${ip_address} :: Error while trying to download ${element} :\n ${err}`.red);
                        return;
                    }
                    console.log(`SFTP Client on tag ${ip_address} :: ${element} downloaded`.cyan);
                    downloaded.push(element);
                    if (attempted.length === csv_list.length) {
                        resolve(downloaded);
                    }
                });
            });
        });
    });
    return promise;
}

module.exports.delete_csv = function (ssh_client, ip_address, csv_list) {

    let commands = ['cd ~/clamour_data/csv_buffer'];
    csv_list.forEach(function (element) {
        commands.push(`rm ${element}`);
    })

    var promise = new Promise(function (resolve, reject) {
        // Shell command line
        ssh_client.shell(function (err, stream) {
            if (err) {
                console.log(`SSH Client on tag ${ip_address} :: Error in shell session while trying to delete .csv files :\n${err}`.red);
                return;
            }

            // Bash commands sent to the tag
            stream.end(commands.join('\n').concat(`\nexit\n`), function () {
                console.log(`SSH Client on tag ${ip_address} :: Shell commands sent to delete .csv files`.magenta);
            });

            // Error handling
            stream.on('error', function (err) {
                console.log(`SSH Client on tag ${ip_address} :: An error while trying to delete .csv files :\n${err}`.red);
                return;
            });

            // Searching for the csv names within the commands
            stream.on('data', function (data) {
            });

            // End of the Shell session
            stream.on('close', function () {
                console.log(`SSH Client on tag ${ip_address} :: Deleted .csv files :${csv_list}`.magenta);
                console.log(`SSH Client on tag ${ip_address} :: End of the shell session`.magenta);
                resolve();
            });
        });
    })
    return promise;
}

module.exports.get_script_status = function (ssh_client, ip_address) {

    let commands = [`echo "<status>" && pgrep -f ${dir.executable_name}`];
    var status;
    var next_data_is_status = { isActivated: "UNKNOWN", pid: "-1" };

    var promise = new Promise(function (resolve, reject) {

        // Shell command line 
        ssh_client.shell(function (err, stream) {
            if (err) {
                console.log(`SSH Client on tag ${ip_address} :: Error in shell session while trying to check the run status :\n${err}`.red);
                reject(err);
                return;
            }

            // Bash commands sent to the tag
            stream.end(commands.join('\n').concat(`\nexit\n`), function () {
                console.log(`SSH Client on tag ${ip_address} :: Shell commands sent to check the run status`.magenta);
            });

            // Error handling
            stream.on('error', function (err) {
                console.log(`SSH Client on tag ${ip_address} :: An error while trying to check the run status of the script :\n${err}`.red);
                reject(err);
                return;
            });

            // Searching for the csv names within the commands
            stream.on('data', function (data) {
                if (next_data_is_status) {
                    if (output_parser.found_script_status(data)) {
                        status = { isActivated: "ON", pid: String(data).trim() };
                        db.query.tags.update_status({ ip_address: ip_address }, 'ON');
                    }
                    else {
                        status = { isActivated: "OFF", pid: "-1" };
                        db.query.tags.update_status({ ip_address: ip_address }, 'OFF');
                    }
                }
                next_data_is_status = output_parser.found_status_cue(data);
            });

            // End of the Shell session
            stream.on('close', function () {
                console.log(`SSH Client on tag ${ip_address} :: clamour script running status found : (Running: ${status.isActivated}, PID: ${status.pid})`.magenta);
                console.log(`SSH Client on tag ${ip_address} :: End of the shell session`.magenta);
                resolve(status);
            });
        });
    })
    return promise;
}

module.exports.stop_script = function (ssh_client, ip_address) {

    let commands_scan = [`echo "<status>" && pgrep -f ${dir.executable_name}`];
    let commands = [`cd ${dir.remote_path.executable}`];
    var pid = "-1";

    var promise = new Promise(function (resolve, reject) {

        // Shell command line 
        ssh_client.shell(function (err, stream) {
            if (err) {
                console.log(`SSH Client on tag ${ip_address} :: Error in shell session while trying to check the run status :\n${err}`.red);
                reject(err);
                return;
            }
            // Bash commands sent to the tag
            stream.end(commands.join('\n').concat(`\nexit\n`), function () {
                console.log(`SSH Client on tag ${ip_address} :: Shell commands sent to check the run status`.magenta);
            });
            // Error handling
            stream.on('error', function (err) {
                console.log(`SSH Client on tag ${ip_address} :: An error while trying to check the run status of the script :\n${err}`.red);
                reject(err);
                return;
            });
            // Searching for the csv names within the commands
            stream.on('data', function (data) {
                if (next_data_is_status) {
                    if (output_parser.found_script_status(data)) {
                        console.log(`PIDs ${data}`);
                        pid = String(data).trim();
                    }
                }
                next_data_is_status = output_parser.found_status_cue(data);
            });

            // End of the Shell session
            stream.on('close', function () {
                console.log(`SSH Client on tag ${ip_address} :: End of the shell session`.magenta);
                resolve(status);
            });
        });

        // Shell command line 
        ssh_client.shell(function (err, stream) {
            if (err) {
                console.log(`SSH Client on tag ${ip_address} :: Error in shell session while trying to stop the script :\n${err}`.red);
                reject(err);
                return;
            }
            // Error handling
            stream.on('error', function (err) {
                console.log(`SSH Client on tag ${ip_address} :: An error while trying to stop the script :\n${err}`.red);
                reject(err);
                return;
            });
            // Bash commands sent to the tag
            stream.end(commands.join('\n').concat(`\nkill ${pid}\n`), function () {
                console.log(`SSH Client on tag ${ip_address} :: Shell commands sent to stop the script`.magenta);
            });
            // Searching for the csv names within the commands
            stream.on('data', function (data) {
                console.log(`${data}`.blue);
            });

            // End of the Shell session
            stream.on('close', function () {
                console.log(`SSH Client on tag ${ip_address} :: Clamour script stoped`.magenta);
                console.log(`SSH Client on tag ${ip_address} :: End of the shell session`.magenta);
                resolve();
            });
        });
    })
    return promise;
}

module.exports.start_script = function (ssh_client, ip_address, arguments = { mode: 'test' }) {

    let commands = [`cd ${dir.remote_path.executable}`,`screen -S snd`,
                    `nohup python3 ${dir.executable_name}${dir.args} &`];
    console.log(`Starting python3 ${dir.executable_name}${dir.args} in ${dir.executable}`);

    var promise = new Promise(function (resolve, reject) {

        // Shell command line 
        ssh_client.shell(function (err, stream) {
            if (err) {
                console.log(`SSH Client on tag ${ip_address} :: Error in shell session while trying to start the script :\n${err}`.red);
                reject(err);
                return;
            }

            // Bash commands sent to the tag
            stream.end(commands.join('\n').concat(`\nexit\n`), function () {
                console.log(`SSH Client on tag ${ip_address} :: Shell commands sent to start the script`.magenta);
                db.query.tags.update_status({ ip_address: ip_address }, 'ON');
            });

            // Error handling
            stream.on('error', function (err) {
                console.log(`SSH Client on tag ${ip_address} :: An error while trying to start the script :\n${err}`.red);
                reject(err);
                return;
            });

            // Searching for the csv names within the commands
            stream.on('data', function (data) {
                console.log(`${data}`.blue);
            });

            // End of the Shell session
            stream.on('close', function () {
                console.log(`SSH Client on tag ${ip_address} :: Clamour script started`.magenta);
                console.log(`SSH Client on tag ${ip_address} :: End of the shell session`.magenta);
                resolve();
            });
        });
    })
    return promise;
}