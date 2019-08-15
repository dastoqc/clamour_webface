const mysql = require('mysql2');
const config = require('../../configuration/database.json')

get_init_mode = function () {
    if (process.env.DB_HOST)
        return config.production;
    return config.development;
}

// Create the connection to database
module.exports.db_connect = async function () {
    return connection = mysql.createConnection(get_init_mode())
}

// Initialize the database tables if they are not initialized yet
module.exports.db_create = function () {
    var promise = new Promise((resolve, reject) => {
        sql = `CREATE DATABASE IF NOT EXISTS \`${get_init_mode().database_name}\`;`
        connection.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; resolve()
        });
    });
    return promise;
}

// Using the database
module.exports.db_use = function () {
    var promise = new Promise((resolve, reject) => {
        sql = `USE \`${get_init_mode().database_name}\`;`
        connection.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; resolve()
        });
    });
    return promise;
}