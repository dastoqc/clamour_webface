var db = require('./database/database');

exports.test_add_tag = async function (req, res, next) {
    tagID = 13;
    IPaddress = '1.1.2.13';
    Password = 12345;
    try {
        await db.query.tags.add({ tag_id: tagID, ip_address: IPaddress, password: Password });
        console.log(await db.query.tags.get_from_ip_address(IPaddress));
        console.log(await db.query.tags.get_from_id(tagID));
        console.log(await db.query.tags.get_password_from_ip_address(IPaddress));
        console.log(await db.query.tags.get_password_from_id(tagID));
    } catch(err){
        console.log(`Error while initializing the database :\n${err}`.red);
    }
    res.render('index', { title: 'Test' });
}

