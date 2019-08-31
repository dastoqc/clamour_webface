var db = require('./database/database');

module.exports.test_tag_queries = async function (req, res, next) {
    tagID = 39;
    IPaddress = '1.3.1.1';
    Password = 12345;
    try {
        // await db.query.tags.add({ tag_id: tagID, ip_address: IPaddress, password: Password });
        // console.log(await db.query.tags.get_from_ip_address(IPaddress));
        // console.log(await db.query.tags.get_from_id(tagID));
        // console.log(await db.query.tags.get_password_from_ip_address(IPaddress));
        // console.log(await db.query.tags.get_password_from_id(tagID));
        // //console.log(await db.query.tags.update_id({tag_id : tagID}, tagID * 100));
        // //console.log(await db.query.tags.update_ip_address({ip_address : IPaddress},  '3.3.3.3'));
        // console.log(await db.query.tags.found({ ip_address: IPaddress }));

        // console.log(await db.query.tags.delete({ip_address:'1.1.1.3'}));

        // console.log(await db.query.tags.update_status({ip_address: '192.168.2.102'}, 'ON'));

        console.log(await db.query.tags.get_all());
        console.log(await db.query.tags.get_number());
    } catch (err) {
        console.log(`Error while testing the tags table functions :\n${err}`.red);
    }
    res.render('index', { title: 'Test tags table functions' });
    return;
}
