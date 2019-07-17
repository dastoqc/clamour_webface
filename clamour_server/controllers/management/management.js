var ssh_manager = require('./manage_ssh')
var tcp_manager = require('./manage_tcp')


exports.get_test = function (req, res, next) {
    res.render('landing', { title: 'Management Route successfully created' });
}

exports.get_ssh_csv = function (req, res, next) {
    ssh_manager.get_csv_list();
    res.redirect('/management');
}

exports.download_csv = function (req, res, next) {
    ssh_manager.download_csv();
    res.redirect('/management');
}

exports.receive_data_stream = function (req, res, next) {
    tcp_manager.listen_to_data_stream();
    res.redirect('/management');
}