var ssh_manager = require('./ssh/manage_ssh');
var network_manager = require('./network/manage_network');
var db = require('../database/database');
var csv_classifier = require('../csv_organizer/csv_classifier')

module.exports.render_page = async function (req, res, next) {
    res.render('management');
}

// Response format
// {
//     "change": String,
//     "tag":{"tag_id": Number,"ip_address": String,"script_status": String}
// }
// Example :
// {
//     "change":"ALREADY TURNED ON",
//     "tag":{"tag_id":4096,"ip_address":"192.168.4.200","script_status":"ON"}
// }
module.exports.start_script = async function (req, res, next) {
    try {
        var change = await ssh_manager.start_script(req.params.ip_address, req.params.mode);
        res.json({
            change: change,
            tag: (await db.query.tags.get_from_ip_address(req.params.ip_address))[0],
        });
    } catch (err) {
        console.log(`Error while trying start the script on a tag :\n ${err}`.red);
        res.json({ error: err });
    }
}

// Response format :
// { 
//    "tag": {"tag_id": Number,"ip_address": String ,"script_status": String },
//    "downloaded_files": [ String ]
// }
// Example :
// { 
//    "tag": {"tag_id":4096,"ip_address":"192.168.4.200","script_status":"OFF"},
//    "downloaded_files": ["test_0x00_2019-08-30-08:50.csv"]
// }
module.exports.stop_tag_download_csv = async function (req, res, next) {
    try {
        await ssh_manager.stop_script(req.params.ip_address);
        var downloaded_csv_files = await ssh_manager.download_all_csv(req.params.ip_address);
        res.json({
            tag: (await db.query.tags.get_from_ip_address(req.params.ip_address))[0],
            downloaded_files: downloaded_csv_files
        });
        csv_classifier.move_files();
    } catch (err) {
        console.log(`Error while trying stop a tag and download its csv files:\n ${err}`.red);
        res.json({ error: err });
    }
}

// Response format :
// { "status": {"isActivated": String,"pid": String}}
// Example :
// {"status":{"isActivated":"ON","pid":"1488"}}
module.exports.get_script_status = async function (req, res, next) {
    try {
        var script_status = await ssh_manager.check_script_status(req.params.ip_address);
        res.json({ status: script_status });
    } catch (err) {
        res.json({ error: err });
    }
}


// Response format :
// { "detected_tag_list" : [{"tag_id" : Number , "ip_address": String , "script_status": String }] }
// Example :
// { "detected_tag_list":
//     [
//          {"tag_id":4100,"ip_address":"192.168.4.21","script_status":"ON"},
//          {"tag_id":4101,"ip_address":"192.168.4.22","script_status":"OFF"},
//          {"tag_id":4102,"ip_address":"192.168.4.23","script_status":"OFF"},
//          {"tag_id":4103,"ip_address":"192.168.4.24","script_status":"OFF"}
//     ]
// }
module.exports.scan_network = async function (req, res, next) {
    try {
        var tag_ip_address_list = await network_manager.scan_for_tag_ip_address();
        var tag_list = [];
        for (var i = 0; i < tag_ip_address_list.length; i++) {
            await ssh_manager.check_script_status(tag_ip_address_list[i]);
            tag_list.push((await db.query.tags.get_from_ip_address(tag_ip_address_list[i]))[0]);
        };
        res.json({ detected_tag_list: tag_list });
    } catch (err) {
        console.log(`Error during the network scanning :\n${err}`.red);
        res.send({ error: err });
    }
}

// Response format :
// { "detected" : Boolean, tag: {"tag_id" : Number , "ip_address": String , "script_status": String } }
// Example :
// {"detected":false,"tag":{"tag_id":1,"ip_address":"192.168.4.161","script_status":"OFF"}}
module.exports.ping_ip_address = async function (req, res, next) {
    try {
        var is_detected = await network_manager.ping_ip_address(req.params.ip_address);
        if (is_detected) {
            await ssh_manager.check_script_status(req.params.ip_address);
        }
        res.json({ detected: is_detected, tag: (await db.query.tags.get_from_ip_address(req.params.ip_address))[0] });
    } catch (err) {
        console.log(`Error during the network scanning :\n${err}`.red);
        res.send({ error: err });
    }
}