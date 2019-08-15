const mysql = require('mysql2');
const color = require('colors');

// Database connection
var db_connection;

module.exports.init_table = function (connection) {
    db_connection = connection;
    var promise = new Promise((resolve, reject) => {
        sql =
            `CREATE TABLE IF NOT EXISTS \`tags\` (
        \`tag_id\` 		SMALLINT UNSIGNED NOT NULL,
        \`ip_address\` 	INT UNSIGNED NULL,
        \`password\` 	VARCHAR(20) NULL,
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

module.exports.add = function (tag) {
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
        `SELECT tag_id, INET_NTOA(ip_address) AS ip_address
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
        `SELECT tag_id, INET_NTOA(ip_address) AS ip_address
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