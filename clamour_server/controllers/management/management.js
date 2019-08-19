var ssh_manager = require('./ssh/manage_ssh')
var tcp_manager = require('./manage_tcp')
var network_manager = require('./network/manage_network')


exports.get_test = function (req, res, next) {
    res.render('landing', { title: 'Management Route successfully created' });
}

exports.get_ssh_csv = function (req, res, next) {
    ssh_manager.download_all_csv(req, res);
    res.redirect('/management');
}

exports.download_csv = function (req, res, next) {
    ssh_manager.download_all_csv();
    res.redirect('/management');
}

exports.receive_data_stream = function (req, res, next) {
    tcp_manager.listen_to_data_stream();
    res.redirect('/management');
}

exports.scan_network = async function (req, res, next) {
    try {
        var ip_address_list = await network_manager.scan_for_tag_ip_address();
    } catch(err) {
        res.json({error : err});
    }
    res.json({tag_ip_addresses : ip_address_list});
}