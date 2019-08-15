const mysql = require('mysql2');
const color = require('colors');

// Using the database
module.exports.create_table = function (connection) {
    var promise = new Promise((resolve, reject) => {
        sql = `CREATE TABLE IF NOT EXISTS \`visits\` (
                \`visit_number\` 	INT UNSIGNED NOT NULL AUTO_INCREMENT,
                \`tag_id\` 		SMALLINT UNSIGNED NOT NULL,
                \`date\` 			DATE NOT NULL,
                \`start_time\` 	TIME NOT NULL,
                \`mode\` 			CHAR(5) NOT NULL,
                PRIMARY KEY (\`visit_number\`));`
        connection.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; resolve()
        });
    });
    return promise;
}

// module.exports.search_tags = function (connection) {
//     var promise = new Promise((resolve, reject) => {
//         sql = `SELECT * FROM Application WHERE ID_u = '1234'`
//         connection.query(sql, function (err, results, fields) {
//             if (err) {
//                 reject(err);
//                 return;
//             }; resolve()
//         });
//     });
//     return promise;
// }