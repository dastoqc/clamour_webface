const mysql = require('mysql2');
const color = require('colors');

// Database connection
var db_connection;

// Using the database
module.exports.init_table = function (connection) {
    db_connection = connection;    
    var promise = new Promise((resolve, reject) => {
        sql = `CREATE TABLE IF NOT EXISTS \`points\` (
            \`visit_number\` 		INT UNSIGNED NOT NULL,
            \`point_number\` 		INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`tim\` 				TIME NOT NULL,
            \`time_since_star\` 	DOUBLE NOT NULL,
            \`time_delta\` 			DOUBLE NOT NULL,
            \`x_position\` 			INT NOT NULL,
            \`y_position\` 			INT NOT NULL,
            \`z_position\` 			INT NOT NULL,
            \`x_speed\` 			INT NOT NULL,
            \`y_speed\` 			INT NOT NULL,
            \`z_speed\` 			INT NOT NULL,
            \`yaw\` 				INT NOT NULL,
            \`yaw_variati\` 		INT NOT NULL,
            PRIMARY KEY (\`visit_number\` ASC, \`point_number\` ASC),
            CONSTRAINT visits_fk
            FOREIGN KEY (\`visit_number\`) REFERENCES visits(\`visit_number\`)
            ON DELETE CASCADE ON UPDATE CASCADE)
            ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;`
        db_connection.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; resolve()
        });
    });
    return promise;
}