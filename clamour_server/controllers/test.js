var db = require('./database/database');

exports.test_add_tag = async function (req, res, next) {
    tagID = 38;
    IPaddress = '1.2.2.4';
    Password = 12345;
    try {
        await db.query.tags.add({ tag_id: tagID, ip_address: IPaddress, password: Password });
        console.log(await db.query.tags.get_from_ip_address(IPaddress));
        console.log(await db.query.tags.get_from_id(tagID));
        console.log(await db.query.tags.get_password_from_ip_address(IPaddress));
        console.log(await db.query.tags.get_password_from_id(tagID));
        //console.log(await db.query.tags.update_id({tag_id : tagID}, tagID * 100));
        //console.log(await db.query.tags.update_ip_address({ip_address : IPaddress},  '3.3.3.3'));
        console.log(await db.query.tags.found({ip_address : IPaddress}));
    } catch(err){
        console.log(`Error while testing the tag table functions :\n${err}`.red);
    }
    res.render('index', { title: 'Test' });
}

