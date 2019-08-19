const mysql = require('mysql2');
const color = require('colors');
const path = require('path');

const points = require('./table_points');
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
            UNIQUE      (tag_id, date, start_time),
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
        // Addition of the visit in the visit's list
        var inner_promise = new Promise((inner_resolve, inner_reject) => {
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
                    inner_reject(err);
                    reject(err);
                    return;
                };
                inner_resolve(results);
            });
        })
            // Addition of the visit's points in the point table
            .then(async function (first_result) {
                try {
                    var second_result = await points.add(csv_name);
                    resolve({ visit_query: first_result, points_query: second_result });
                }
                catch (err) {
                    reject(err);
                };
            });
    });
    return promise;
}

module.exports.get_all_equal_field = function (visit_info) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `SELECT * FROM visits
            WHERE 
            visit_number = ? 
            OR tag_id = ?
            OR date = ?
            OR start_time = ?
            OR mode = ?`;
        param =
            [visit_info.visit_number,
            visit_info.tag_id,
            visit_info.date,
            visit_info.start_time,
            visit_info.mode];
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

module.exports.get_equal_field_time_restricted = function (visit_info, start_date = new Date(), end_date = new Date()) {
    var promise = new Promise((resolve, reject) => {
        // Default values from 7 days before to today
        if (!start_date) {
            start_date.setDate(end_date.getDate() - 7);
        }
        sql =
            `SELECT * FROM visits
            WHERE 
            (visit_number = ? 
            OR tag_id = ?
            OR date = ?
            OR start_time = ?
            OR mode = ?)
            AND date >= ?
            AND date <= ?`;
        param =
            [visit_info.visit_number,
            visit_info.tag_id,
            visit_info.date,
            visit_info.start_time,
            visit_info.mode,
                start_date,
                end_date];
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

module.exports.delete_equal_field = function (visit_number) {


    var promise = new Promise((resolve, reject) => {
        var inner_promise = new Promise((inner_resolve, inner_reject) => {
            sql =
                `DELETE FROM visits
                WHERE visit_number = ?`;
            param = [visit_number];
            db_connection.query(sql, param, (err, results, fields) => {
                if (err) {
                    inner_reject(err);
                    reject(err);
                    return;
                };
                inner_resolve(results);
            });
        })
            .then(async function (first_result) {
                try {
                    var second_result = await points.delete(visit_number);
                    resolve({ visit_query: first_result, points_query: second_result });
                }
                catch (err) {
                    reject(err);
                };
            });
    });
    return promise;
}

module.exports.get_points = function (visit_number) {
    var promise = new Promise(async function (resolve, reject) {
        try {
            var result = await points.get(visit_number);
            resolve(result);
        }
        catch (err) {
            resolve(err);
        }
    });
    return promise;
}