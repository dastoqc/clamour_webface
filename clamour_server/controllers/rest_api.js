var db = require('./database/database');

module.exports.get_all_tags = async function (req, res, next) {
    res.json(await db.query.tags.get_all());
}

module.exports.create_tag = async function (req, res, next) {
    res.json(await db.query.tags.add({ tag_id: req.body.tag_id, ip_address: req.body.ip_address, password: req.body.password }));
}

module.exports.delete_all_tags = async function (req, res, next) {
    res.json(await db.query.tags.delete_all_tags());
}

module.exports.get_tag = async function (req, res, next) {
    res.json(await db.query.tags.get_from_id(req.params.tag_id));
}

module.exports.update_tag = async function (req, res, next) {
    if (req.body.tag_id)
        await db.query.tags.update_id({ tag_id: req.params.tag_id }, req.body.tag_id);
    if (req.body.ip_address)
        await db.query.tags.update_id({ tag_id: req.params.tag_id }, req.body.ip_address);
    if (req.body.password)
        await db.query.tags.update_id({ tag_id: req.params.tag_id }, req.body.password);
    res.json(await db.query.tags.get_from_id(req.params.tag_id));
}

module.exports.delete_tag = async function (req, res, next) {
    res.json(await db.query.tags.delete({ tag_id: req.params.tag_id }));
}