var db = require('./database/database');

exports.test_add_tag = async function (req, res, next) {
    try {
        await db.query.tags.add({ tag_id: 1, ip_address: '123.123.123.1', password: 12345 });
    }catch(err){
        console.log(`Error while initializing the database :\n${err}`.red);
    }
    res.render('index', { title: 'Test' });
}

