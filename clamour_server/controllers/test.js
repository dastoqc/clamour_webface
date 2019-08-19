var db = require('./database/database');

module.exports.test_tag_queries = async function (req, res, next) {
    tagID = 38;
    IPaddress = '1.2.2.4';
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

        console.log(await db.query.tags.delete({ip_address:'1.1.1.3'}))
    } catch (err) {
        console.log(`Error while testing the tags table functions :\n${err}`.red);
    }
    res.render('index', { title: 'Test tags table functions' });
    return;
}

module.exports.test_visits_queries = async function (req, res, next) {
    var test_date = new Date(2019, 7 - 1, 20);

    var test_start_date = new Date(2019, 7 -1, 20);
    try {
        // Test addition of visits
        console.log(await db.query.visits.add('test_0x1008_2019-07-20-16:00.csv'));
        console.log(await db.query.visits.add('visit0x1008_2019-07-20-14:57.csv'));

        // // Test the fetching of data
        // // console.log(await db.query.visits.get_all_equal_field({ visit_number: 38 }));
        // // console.log(await db.query.visits.get_all_equal_field({ tag_id: 4104 }));
        // // console.log(await db.query.visits.get_all_equal_field({ mode: 'test' }));
        // // console.log(test_date);
        // // console.log(await db.query.visits.get_all_if_equal_field({ date: test_date }));

        // // Test the fetching of data
        // console.log(await db.query.visits.get_equal_field_time_restricted({ visit_number: 38 }));
        // console.log(await db.query.visits.get_equal_field_time_restricted({ tag_id: 4104 }));
        // console.log(await db.query.visits.get_equal_field_time_restricted({ mode: 'test' }, test_start_date));
        // console.log(test_date);
        // console.log(await db.query.visits.get_equal_field_time_restricted({ date: test_date }));

        // console.log(await db.query.visits.delete_equal_field({ mode: 'test' }, test_start_date));

        console.log(await db.query.visits.get_points(1));

    } catch (err) {
        console.log(`Error while testing the visits table functions :\n${err}`.red);
    }
    res.render('index', { title: 'Test visits table functions' });
    return;
}