const mysql = require('mysql2');
const color = require('colors');

// Database connection
var db_connection;

// Using the database
module.exports.init_table = function (connection) {
    db_connection = connection;
    var promise = new Promise((resolve, reject) => {
        sql = `CREATE TABLE IF NOT EXISTS \`tags\` (
                \`tag_id\` 		SMALLINT UNSIGNED NOT NULL,
                \`ip_address\` 	INT UNSIGNED NULL,
                \`password\` 	VARCHAR(20) NULL,
                PRIMARY KEY (\`tag_id\`),
                UNIQUE INDEX \`tag_id_UNIQUE\` (\`tag_id\` ASC),
                UNIQUE INDEX \`ip_address_UNIQUE\` (\`ip_address\` ASC));`
        db_connection.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; resolve()
        });
    });
    return promise;
}