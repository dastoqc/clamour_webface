var Client = require('ssh2').Client;
var color = require('colors');
var path = require('path');

var dir = require('../../../configuration/directories')


module.exports.get_csv_list = function (res, req, ssh_client) {
    // Bash commands to get the list of csv files
    let commands = ['cd ~/clamour_data/csv_buffer\n', 'ls *.csv\n']

    // Function used on the data outputed
    dataFunction = function (req, res, data, static_data) {
        let csv_name_seeker = null;
        if (csv_name_seeker = find_csv_names_from_ssh_output(data.toString())){
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

        stream.end(`'ls *.csv\n'exit\n`, function () {
            console.log(`SSH commands sent to the tag ${req.params.ip_address}`.magenta);
        });
        // // Bash commands sent to the tag
        // var excecuteCommands = new Promise(function (resolve, reject) {
        //     for (var i = 0; i < commands.length; i++) {
        //         stream.write(`${commands[i]}\n`, function () {
        //             console.log(`SSH Client :: ${commands[i]}`.magenta);
        //         });
        //     } resolve();
        // })
        //     .then(function () {
        //         stream.end(`exit\n`, function () {
        //             console.log(`SSH Client :: End of the shell session on the tag ${req.params.ip_address}`.magenta);
        //         });
        //     })
        //     .catch (function(err) {
        //     stream.end(`exit\n`, function () {
        //         console.log(`An error occured during the shell session on the tag ${req.params.ip_address} :\n  ${err}`.red);
        //     });
        // })

        // Bash commands sent to the tag

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
            closeFunction(static_data);
            console.log(`SSH Client :: End of the ssh connection on the tag`.magenta);
            ssh_client.end();
        });
    });
}


