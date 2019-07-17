var ssh_manager = require('./manage_ssh')



exports.get_test = function (req, res, next) {
    res.render('landing', { title: 'Management Route successfully created' });
}

exports.get_ssh_csv = function (req, res, next) {
    ssh_manager.get_csv_list();
    res.redirect('/management');
}