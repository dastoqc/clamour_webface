var Client = require('ssh2').Client;
var color = require('colors')


exports.get_csv_list = function (req, res, next) {

    // Variable declaration
    var ssh_client = new Client();
    let csv_list = null;

    // Bash commands to get the list of csv files
    let bash_command_cd = 'cd ~/clamour_data/csv_buffer\n';
    let bash_command_ls = 'ls *.csv\n';

    // Establishing connection with tag
    ssh_client.connect({
        host: '192.168.2.101',
        port: 22,
        username: 'pi',
        password: 'calypso2017'
    });

    // Error handling
    ssh_client.on('error', function (err) {
        console.log('An error occured in the connection while trying to get the list of csv files on a tag via SSH :'.red);
        console.log(`Level: ${err.level} \n${err.stack}`.red)
    })

    // End of communication
    ssh_client.on('end', function () {
        console.log('SSH Client :: End of SSH communication with tag'.yellow);
    })

    // Actions to take upon the start of the connection
    ssh_client.on('ready', function () {
        console.log('SSH Client :: connection established with tag'.green);

        // Opening a shell command line
        ssh_client.shell(function (err, stream) {
            if (err) throw err;

            // Bash commands sent to the tag
            stream.end(`${bash_command_cd}${bash_command_ls}exit\n`, function () {
                console.log('SSH Client :: Commands sent to get the list of csv files in the tag'.magenta);
            });

            // Searching for the csv names within the commands
            stream.on('data', function (data) {
                let csv_name_seeker = null;
                if (csv_name_seeker = find_csv_names_from_ssh_output(data.toString()))
                    csv_list = csv_name_seeker;
            });

            // Error handling
            stream.on('error', function (error_stream) {
                console.log('An error occured in the stream while trying to get the list of csv files on a tag via SSH :'.red);
                console.log(`${error_stream}`.red)
            });


            // End of the Shell session and end of the ssh client
            stream.on('close', function () {
                console.log(`SSH Client :: List of csv files found on the tag : ${csv_list}`.magenta);
                ssh_client.end();
            });
        });
    });
}

exports.download_csv = function (req, res, next) {
    let ssh_client = new Client();
    ssh_client.connect({
        host: '192.168.2.101',
        port: '22',
        username: 'pi',
        password: 'calypso2017'
    })

    // Actions to take upon the start of the connection
    ssh_client.on('ready', function () {
        console.log('SSH Client :: connection established with tag'.green);

        // Setting an SFTP client to download the csv files
        ssh_client.sftp(function (err, sftp_client) {
            if (err) {
                console.log(`An error occured while trying start an sftp client to download a csv file :\n ${err}`.red);
                return;
            }
            // Downloading the csv file
            sftp_client.fastGet('/home/pi/clamour_data/csv_buffer/abc123.csv', '/home/alexandre/clamour_data/csv_buffer/abc123.csv', function (err) {
                if (err) {
                    console.log(`An error occured while trying to download a csv file :\n ${err}`.red);
                    return;
                }
                console.log('THE ABC.CSV FILE WAS DOWNLOADED!!!');
            });
        });
    });



    // then(() => {
    //     sftp.fastGet(`~/clamour_data/csv_buffer/abc123`, `~/clamour_data/csv_buffer/abc123`);
    // });





}

function find_csv_names_from_ssh_output(ssh_output_string) {
    var reg_expression = RegExp(/\b.*?((?!\*).)\.csv/g); // /\b.*?\.csv/
    var csv_files_list = null;
    if (csv_files_list = ssh_output_string.match(reg_expression)) {
        for (i = 0, len = csv_files_list.length; i < len; i++) {
            csv_files_list[i] = csv_files_list[i].trim();
        }
    }
    return csv_files_list;
}