const mysql = require('mysql2');
const color = require('colors');

// Using the database
module.exports.create_table = function (connection) {
    var promise = new Promise((resolve, reject) => {
        var inner_promise = new Promise((in_resolve, in_reject) => {
            sql = `CREATE TABLE IF NOT EXISTS \`tags\` (
                \`tag_id\` 		SMALLINT UNSIGNED NOT NULL,
                \`ip_address\` 	INT UNSIGNED NULL,
                \`password\` 	VARCHAR(20) NULL,
                PRIMARY KEY (\`tag_id\`),
                UNIQUE INDEX \`tag_id_UNIQUE\` (\`tag_id\` ASC),
                UNIQUE INDEX \`ip_address_UNIQUE\` (\`ip_address\` ASC));`
            connection.query(sql, function (err, results, fields) {
                if (err) {
                    reject(err);
                    return;
                }; resolve(results)
            });
        }).then(
            
        );
    });
    return promise;
}