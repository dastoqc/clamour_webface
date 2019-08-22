var db = require('../database/database');

module.exports.render_page = async function (req, res, next) {
    var tag_number = await db.query.tags.get_number();
    res.render('setup', {tag_number : tag_number});
}