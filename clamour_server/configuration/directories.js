const path = require('path');

// Path definitions
var local_path_base         = path.join(process.env.HOME || process.env.USERPROFILE, 'clamour_data');
var local_path_csv_buffer   = path.join(local_path_base, 'csv_buffer');
var local_path_csv_sorted   = path.join(local_path_base, 'csv_sorted');
var remote_path_base        = '/home/pi/clamour_data';
var remote_path_csv_buffer  = path.join(remote_path_base, 'csv_buffer');
var remote_path_excecutable = path.join(remote_path_base);

// Module export
module.exports = {
    "local_path"  : {
        "base"       : local_path_base,
        "csv_buffer" : local_path_csv_buffer,
        "csv_sorted" : local_path_csv_sorted
     },

    "remote_path" : {
        "base"       : remote_path_base,
        "csv_buffer" : remote_path_csv_buffer,
        "executable" : remote_path_excecutable
    }
};