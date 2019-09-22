var fs = require('fs');
var path = require('path');
const color = require('colors');
var dir = require('../../configuration/directories');
var db = require('../database/database');

tag_id_name = async function (ip_address) {
    try { 
        var tag = await db.query.tags.get_from_ip_address(ip_address);
        return tag[0].tag_id;
    } catch (err) {
        console.log(`An error occured while trying to get the ID of IP address ${ip_address} : \n${err}`.red)
    }
}

today_name = function () {
    var today = new Date();
    return `${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}`;
}

get_folder = async function (ip_address) {
    try {
        var tag_id_folder_name = path.join(dir.local_path.csv_sorted, `${await tag_id_name(ip_address)}`);
        var today_folder_name = path.join(tag_id_folder_name, today_name());
        if (!fs.existsSync(tag_id_folder_name)) {
            fs.mkdirSync(`${tag_id_folder_name}`);
            console.log(`Folder ${tag_id_folder_name} created`.cyan)
        }
        if (!fs.existsSync(today_folder_name)) {
            fs.mkdirSync(`${today_folder_name}`);
            console.log(`Folder ${today_folder_name} created`.cyan)
        }
        return today_folder_name;
    } catch (err) {
        console.log(`An error occured while trying to get the folder to classify the csv files : \n${err}`.red)
    }
}

module.exports.move_files = async function (ip_address) {
    try {
        fs.readdir(dir.local_path.csv_buffer, function (err, files) {
            files.forEach(async function (file) {
                fs.rename(
                    path.join(dir.local_path.csv_buffer, file),
                    path.join(`${await get_folder(ip_address)}`, file),
                    async function () {
                        console.log(`File ${file} moved to ${await get_folder(ip_address)}`.cyan);
                    });
            });
        });
    } catch (err) {
        console.log(`Error while trying to sort csv file :\n ${err.message}`.red);
    }
}
