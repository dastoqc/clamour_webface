var ssh_manager = require('./ssh/manage_ssh');
var tcp_manager = require('./manage_tcp');
var network_manager = require('./network/manage_network');
var db = require('../database/database');

exports.get_test = function (req, res, next) {
    res.render('landing', { title: 'Management Route successfully created' });
}

exports.stop_tag_download_csv = async function (req, res, next) {
    try {
        var dowloaded_csv_files = await ssh_manager.download_all_csv(req.params.ip_address);
        res.json({ dowloaded_files: dowloaded_csv_files });
    } catch (err) {
        res.json({ error: err });
    }
}

exports.receive_data_stream = function (req, res, next) {
    tcp_manager.listen_to_data_stream();
    res.redirect('/management');
}

exports.get_running_status = async function (req, res, next) {
    try {
        var running_status = await ssh_manager.check_running_status(req.params.ip_address);
        res.json({ status: running_status });
    } catch (err) {
        res.json({ error: err });
    }
}

//{ID : 1234, IP: 123.123.123.123, Status : {isRunning: ON/OFF/UKNONWN, pid: 1234}}

// { [TAG : {ID:, IP:, Status:},
//    TAG : {ID:, IP:, Status:},
//    TAG : {ID:, IP:, Status:}]}
exports.scan_network = async function (req, res, next) {
    try {
        var tag_ip_address_list = await network_manager.scan_for_tag_ip_address();
        var tag_list = [];
        for (var i = 0; i < tag_ip_address_list.length; i++) {
            await ssh_manager.check_running_status(tag_ip_address_list[i]);
            tag_list.push((await db.query.tags.get_from_ip_address(tag_ip_address_list[i]))[0]);
        };
        res.json(tag_list);
    } catch (err) {
        console.log(`Error during the network scanning :\n${err}`.red);
        res.send({ error: err });
    }
}