var db = require('./database/database');

module.exports.get_all_tags = async function (req, res, next) {
    try {
        result = await db.query.tags.get_all();
        res.json(result);
    } catch (err) {
        res.json(err);
    }
}

// Successful entry response :  
// Failed database query format : {code: "ER_DUP_ENTRY", errno: 1062, sqlState: "23000", sqlMessage: "Duplicate entry '2' for key 'PRIMARY'"}
module.exports.create_tag = async function (req, res, next) {
    try {
        result = await db.query.tags.add({ 
            tag_id: req.body.data.tag_id, 
            ip_address: req.body.data.ip_address, 
            password: req.body.data.password 
        });
        res.json(result);
    } catch (err) {
        res.json(err);
    }
}

module.exports.delete_all_tags = async function (req, res, next) {
    try {
        result = await db.query.tags.delete_all_tags();
        res.json(result);
    } catch (err) {
        res.json(err);
    }
}

module.exports.get_tag = async function (req, res, next) {
    try {
        result = await db.query.tags.get_from_id(req.params.tag_id);
        res.json(result);
    } catch (err) {
        res.json(err);
    }
}

module.exports.update_tag = async function (req, res, next) {
    try {
        if (req.body.tag_id)
            await db.query.tags.update_id({ tag_id: req.params.tag_id }, req.body.data.tag_id);
        if (req.body.ip_address)
            await db.query.tags.update_id({ tag_id: req.params.tag_id }, req.body.data.ip_address);
        if (req.body.password)
            await db.query.tags.update_id({ tag_id: req.params.tag_id }, req.body.data.password);
        result = await db.query.tags.get_from_id(req.params.tag_id);
        res.json(result);
    } catch (err) {
        res.json(err);
    }
}

module.exports.delete_tag = async function (req, res, next) {
    try {
        result = await db.query.tags.delete({ tag_id: req.params.tag_id });
        res.json(result);
    } catch (err) {
        res.json(err);
    }
}