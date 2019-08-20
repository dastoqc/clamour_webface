var ssh_manager = require('./ssh/manage_ssh')
var tcp_manager = require('./manage_tcp')
var network_manager = require('./network/manage_network')


exports.get_test = function (req, res, next) {
    res.render('landing', { title: 'Management Route successfully created' });
}

exports.get_ssh_csv = async function (req, res, next) {
    try {
        var dowloaded_csv_files = await ssh_manager.download_all_csv(req.params.ip_address);
        res.json({ dowloaded_files: dowloaded_csv_files });
    } catch (err) {
        res.json({ error: err });
    }
}

exports.download_csv = function (req, res, next) {
    ssh_manager.download_all_csv();
    res.redirect('/management');
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
exports.scan_network = async function (req, res, next) {
    try {
        var ip_address_list = await network_manager.scan_for_tag_ip_address();
        res.json({ tag_ip_addresses: ip_address_list });
    } catch (err) {
        res.send({error : err});
    }
}