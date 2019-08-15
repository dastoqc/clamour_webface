const mysql = require('mysql2');
const color = require('colors');

// Database connection
var db_connection;

// Using the database
module.exports.init_table = function (connection) {
    db_connection = connection;
    var promise = new Promise((resolve, reject) => {
        sql = `CREATE TABLE IF NOT EXISTS \`visits\` (
                \`visit_number\` 	INT UNSIGNED NOT NULL AUTO_INCREMENT,
                \`tag_id\` 		    SMALLINT UNSIGNED NOT NULL,
                \`date\` 			DATE NOT NULL,
                \`start_time\` 	    TIME NOT NULL,
                \`mode\` 			CHAR(5) NOT NULL,
                PRIMARY KEY (\`visit_number\`));`
        db_connection.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; resolve()
        });
    });
    return promise;
}

