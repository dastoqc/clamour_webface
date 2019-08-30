var ssh_manager = require('./ssh/manage_ssh');
var network_manager = require('./network/manage_network');
var db = require('../database/database');

module.exports.render_page = async function (req, res, next) {
    var tag_number = await db.query.tags.get_number();
    res.render('management', {tag_number : tag_number});
}

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

module.exports.stop_tag_download_csv = async function (req, res, next) {
    try {
        await ssh_manager.stop_script(req.params.ip_address);
        var downloaded_csv_files = await ssh_manager.download_all_csv(req.params.ip_address);
        res.json({
            tag: (await db.query.tags.get_from_ip_address(req.params.ip_address))[0],
            downloaded_files: downloaded_csv_files
        });
    } catch (err) {
        console.log(`Error while trying stop a tag and download its csv files:\n ${err}`.red);
        res.json({ error: err });
    }
}

module.exports.get_running_status = async function (req, res, next) {
    try {
        var running_status = await ssh_manager.check_running_status(req.params.ip_address);
        res.json({ status: running_status });
    } catch (err) {
        res.json({ error: err });
    }
}

// { [TAG : {ID:, IP:, Status:},
//    TAG : {ID:, IP:, Status:},
//    TAG : {ID:, IP:, Status:}]}
module.exports.scan_network = async function (req, res, next) {
    try {
        var tag_ip_address_list = await network_manager.scan_for_tag_ip_address();
        var tag_list = [];
        for (var i = 0; i < tag_ip_address_list.length; i++) {
            await ssh_manager.check_running_status(tag_ip_address_list[i]);
            tag_list.push((await db.query.tags.get_from_ip_address(tag_ip_address_list[i]))[0]);
        };
        res.json({
            detected_tag_list: tag_list
        });
    } catch (err) {
        console.log(`Error during the network scanning :\n${err}`.red);
        res.send({ error: err });
    }
}