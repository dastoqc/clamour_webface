var fs = require('fs');
var dir = require('../../configuration/directories');

module.exports.generate_file_structure = function () {
    if (!fs.existsSync(dir.local_path.base)) {
        fs.mkdirSync(`${dir.local_path.base}`);
        console.log(`Folder ${dir.local_path.base} created`.cyan)
    }

    if (!fs.existsSync(dir.local_path.csv_buffer)) {
        fs.mkdirSync(`${dir.local_path.csv_buffer}`);
        console.log(`Folder ${dir.local_path.csv_buffer} created`.cyan)
    }

    if (!fs.existsSync(dir.local_path.csv_sorted)) {
        fs.mkdirSync(`${dir.local_path.csv_sorted}`);
        console.log(`Folder ${dir.local_path.csv_sorted} created`.cyan)
    }
}