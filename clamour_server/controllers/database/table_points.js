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
            `CREATE TABLE IF NOT EXISTS \`points\` (
            \`visit_number\` 		INT UNSIGNED NOT NULL,
            \`point_number\` 		INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`time\` 				TIME NOT NULL,
            \`time_since_start\` 	DOUBLE NOT NULL,
            \`time_delta\` 			DOUBLE NOT NULL,
            \`x_position\` 			INT NOT NULL,
            \`y_position\` 			INT NOT NULL,
            \`z_position\` 			INT NOT NULL,
            \`x_speed\` 			INT NOT NULL,
            \`y_speed\` 			INT NOT NULL,
            \`z_speed\` 			INT NOT NULL,
            \`yaw\` 				INT NOT NULL,
            \`yaw_variation\` 		INT NOT NULL,
            PRIMARY KEY (\`visit_number\` ASC, \`point_number\` ASC),
            CONSTRAINT visits_fk
            FOREIGN KEY (\`visit_number\`) REFERENCES visits(\`visit_number\`)
            ON DELETE CASCADE ON UPDATE CASCADE)
            ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;`
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
            `
            LOAD DATA LOCAL INFILE ? 
	        INTO TABLE points
	        FIELDS TERMINATED BY ',' 
	        ENCLOSED BY '"'
	        LINES TERMINATED BY '\n'
	        IGNORE 1 ROWS
	        (@col1, @col2, @col3, @col4, @col5, @col6, @col7, @col8, @col9, @col10, @col11)
	        SET visit_number = (SELECT MAX(visit_number) FROM visits),
	        time 	   = @col1, 	time_since_start = @col2, 		time_delta = @col3, 
	        x_position = @col4, 	y_position		 = @col5, 		z_position = @col6,
	        x_speed	   = @col7, 	y_speed			 = @col8, 		z_speed	   = @col9, 
            yaw		   = @col10,	yaw_variation	 = @col11;
            `;
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

module.exports.get = function (visit_number) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `SELECT *
            FROM points
            WHERE visit_number = ?`;
        param = [visit_number];
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
// Get points
// Delete points