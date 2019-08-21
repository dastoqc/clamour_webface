const mysql = require('mysql2');
const color = require('colors');

// Database connection
var db_connection;

module.exports.init_table = function (connection) {
    db_connection = connection;
    var promise = new Promise((resolve, reject) => {
        sql =
            `CREATE TABLE IF NOT EXISTS \`tags\` (
            \`tag_id\` 		    SMALLINT UNSIGNED NOT NULL,
            \`ip_address\` 	    INT UNSIGNED NULL,
            \`password\` 	    VARCHAR(20) NULL,
            \`script_status\` 	VARCHAR(7) NULL DEFAULT 'UNKNOWN',
            PRIMARY KEY (\`tag_id\`),
            UNIQUE INDEX \`tag_id_UNIQUE\` (\`tag_id\` ASC),
            UNIQUE INDEX \`ip_address_UNIQUE\` (\`ip_address\` ASC));`;
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

module.exports.add = function (tag = {tag_id : -1, ip_address : '0.0.0.0'}) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `INSERT INTO tags (tag_id, ip_address, password) 
            VALUES (?, INET_ATON(?), ?)`;
        param = [tag.tag_id, tag.ip_address, tag.password || ''];
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

module.exports.get_from_id = function (id) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `SELECT tag_id, INET_NTOA(ip_address) AS ip_address, script_status
            FROM tags
            WHERE tag_id = ?`;
        param = [id];
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

module.exports.get_from_ip_address = function (ip_address) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `SELECT tag_id, INET_NTOA(ip_address) AS ip_address, script_status
            FROM tags
            WHERE ip_address = INET_ATON(?)`;
        param = [ip_address];
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

module.exports.get_password_from_ip_address = function (ip_address) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `SELECT password
            FROM tags
            WHERE ip_address = INET_ATON(?)`;
        param = [ip_address];
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

module.exports.get_password_from_id = function (id) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `SELECT password
            FROM tags
            WHERE tag_id = ?`;
        param = [id];
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

module.exports.update_id = function (tag = {tag_id : -1, ip_address : '0.0.0.0'}, new_id = 0) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `UPDATE tags
            SET tag_id = ?
            WHERE tag_id = ? OR ip_address = INET_ATON(?)`;
        param = [new_id, tag.tag_id, tag.ip_address];
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

module.exports.update_ip_address = function (tag = {tag_id : -1, ip_address : '0.0.0.0'}, new_ip_address = '0.0.0.0') {
    var promise = new Promise((resolve, reject) => {
        sql =
            `UPDATE tags
            SET ip_address = INET_ATON(?)
            WHERE tag_id = ? OR ip_address = INET_ATON(?)`;
        param = [new_ip_address, tag.tag_id, tag.ip_address];
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

module.exports.update_status = function (tag = {tag_id : -1, ip_address : '0.0.0.0'}, status = 'UNKNOWN') {
    var promise = new Promise((resolve, reject) => {
        sql =
            `UPDATE tags
            SET script_status = ?
            WHERE tag_id = ? OR ip_address = INET_ATON(?)`;
        param = [status, tag.tag_id, tag.ip_address];
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

module.exports.delete = function (tag = {tag_id : -1, ip_address : '0.0.0.0'}) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `DELETE FROM tags WHERE
            tag_id = ?
            OR ip_address = INET_ATON(?)`;
        param = [tag.tag_id, tag.ip_address];
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

module.exports.found = function (tag = {tag_id: -1, ip_address: "0.0.0.0"}) {
    var promise = new Promise((resolve, reject) => {
        sql =
            `SELECT EXISTS(SELECT * from tags 
            WHERE tag_id = ? OR ip_address = INET_ATON(?)) AS found;`;
        param = [tag.tag_id, tag.ip_address];
        db_connection.query(sql, param, (err, results, fields) => {
            if (err) {
                reject(err)
                return;
            };
            (results[0].found != 0) ? resolve(true) : resolve(false);
        });
    });
    return promise;
}