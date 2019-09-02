var fs = require('fs');
var path = require('path');
var dir = require('../../configuration/directories');

today_name = function () {
    var today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

get_today_folder = function () {
    var today_folder_name = path.join(dir.local_path.csv_sorted, today_name());
    if (!fs.existsSync(today_folder_name)) {
        fs.mkdirSync(`${today_folder_name}`);
        console.log(`Folder ${today_folder_name} created`.cyan)
    }
    return today_folder_name;
}

module.exports.move_files = async function () {
    try {
        fs.readdir(dir.local_path.csv_buffer, function (err, files) {
            files.forEach(function (file) {
                fs.rename(
                    path.join(dir.local_path.csv_buffer, file),
                    path.join(get_today_folder(), file),
                    function () {
                        console.log(`File ${file} moved to ${get_today_folder()}`.cyan);
                    });
            });
        });
    } catch (err) {
        console.log(`Error while trying to sort csv file :\n ${err.message}`.red);
    }
}