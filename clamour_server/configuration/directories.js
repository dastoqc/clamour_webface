const path = require('path');

// Path definitions
var local_path_base         = path.join(process.env.HOME || process.env.USERPROFILE, 'clamour_data');
var local_path_csv_buffer   = path.join(local_path_base, 'csv_buffer');
var local_path_database     = path.join(local_path_base, 'mysql');
var remote_path_base        = '/home/pi/clamour_data';
var remote_path_csv_buffer  = path.join(remote_path_base, 'csv_buffer');

// Module export
module.exports = {
    "local_path"  : {
        "base"       : local_path_base,
        "csv_buffer" : local_path_csv_buffer,
        "database"   : local_path_database
     },

    "remote_path" : {
        "base"       : remote_path_base,
        "csv_buffer" : remote_path_csv_buffer,
    }
};