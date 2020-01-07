const path = require('path');

// Path definitions
var local_path_base         = path.join(process.env.HOME || process.env.USERPROFILE, 'clamour_data');
var local_path_csv_buffer   = path.join(local_path_base, 'csv_buffer');
var local_path_csv_sorted   = path.join(local_path_base, 'csv_sorted');
var remote_path_base        = '/home/pi/clamour';
var remote_path_csv_buffer  = path.join(remote_path_base, 'csv_buffer');
var remote_path_excecutable = '/home/pi/clamour/src';

// Module export
module.exports = {
    executable_name  : "clamour.py",
    args : " 0 0 &> /home/pi/log.txt",
    
    "local_path"  : {
        "base"       : local_path_base,
        "csv_buffer" : local_path_csv_buffer,
        "csv_sorted" : local_path_csv_sorted
     },

    "remote_path" : {
        "base"       : remote_path_base,
        "csv_buffer" : remote_path_excecutable,
        "executable" : remote_path_excecutable
    }
};
