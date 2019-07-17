var Client = require('ssh2').Client;

exports.get_csv_list = function (req, res, next) {

    var conn = new Client();
    let csv_list = null;

    conn.on('ready', function () {
        console.log('SSH Client :: connection established with tag');
        let bash_command_cd = 'cd ~/clamour_data/csv_buffer\n';
        let bash_command_ls = 'ls *.csv\n';

        // Opening a shell command line
        conn.shell(function (err, stream) {
            // Throwing an error if a problem occurs during connection
            if (err) throw err;

            stream.end(`${bash_command_cd}${bash_command_ls}exit\n`, function () {
                console.log('Commands were sent to get the list of csv files in the tag');
            });

            stream.on('data', function (data) {
                let csv_name_seeker = null;
                if (csv_name_seeker = find_csv_names_from_ssh_output(data.toString()))
                    csv_list = csv_name_seeker;
            });

            stream.on('close', function () {
                console.log(`List of csv files found on the tag : ${csv_list}`);
                console.log('SSH Client :: End of communication with tag');
                conn.end();
            });
        });
    }).connect({
        host: '192.168.2.101',
        port: 22,
        username: 'pi',
        password: 'calypso2017'
    });
}

exports.download_csv = function (req, res, next) {
    let sftp = new Client();
    sftp.connect({
        host: '192.168.2.101',
        port: '22',
        username: 'pi',
        password: 'calypso2017'
    }).then(() => {
        sftp.fastGet(`~/clamour_data/csv_buffer`, `~/clamour_data/csv_buffer`);
    });
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