const mysql = require('mysql2');
const color = require('colors');
const path = require('path');

const dir = require('../../configuration/directories');


// Database connection
var db_connection;

// Using the database
module.exports.init_table = function (connection) {
    db_connection = connection;
    var promise = new Promise((resolve, reject) => {
        sql = 
         `CREATE TABLE IF NOT EXISTS \`visits\` (
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
            }; 
            resolve(results);
        });
    });
    return promise;
}

module.exports.add = function (csv_name) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `LOAD DATA LOCAL INFILE ? 
            INTO TABLE visits
            FIELDS TERMINATED BY ',' 
            ENCLOSED BY '"'
            LINES TERMINATED BY 'only_first_line'
            (@col1, @col2, @col3, @col4)
            SET  
            tag_id = @col1, date = @col2, start_time = @col3, mode = TRIM('\\n\\r' FROM @col4);`;
        param = [path.join(dir.local_path.csv_buffer, csv_name)];
        db_connection.query(sql, param, (err, results, fields) => {
            if (err) {
                reject(err);
                return;
            };
            resolve(results);
        });
    });
    return promise;
}

module.exports.get_if_equal_field = function (visit_info) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `SELECT * FROM visits
            WHERE 
            visit_number = ? 
            OR tag_id = ?
            OR date = ?
            OR mode = ?`;
        param = [visit_info.visit_number, visit_info.tag_id, visit_info.date, visit_info.mode];
        db_connection.query(sql, param, (err, results, fields) => {
            if (err) {
                reject(err)
                return;
            };
            resolve(results);
        });
    });
    return promise;
}
