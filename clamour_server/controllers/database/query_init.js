const mysql = require('mysql2');
const config = require('../../configuration/database.json')

var connection; 

// Create the connection to database
module.exports.db_connect = async function () {
    connection = mysql.createConnection(config.connection)
    return connection;
}

// Initialize the database tables if they are not initialized yet
module.exports.db_create = function () {
    var promise = new Promise((resolve, reject) => {
        sql = `CREATE DATABASE IF NOT EXISTS \`${config.database_name}\`;`
        connection.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; 
            resolve(results);
        });
    });
    return promise;
}

// Using the database
module.exports.db_use = function () {
    var promise = new Promise((resolve, reject) => {
        sql = `USE \`${config.database}\`;`
        connection.query(sql, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; 
            resolve(results);
        });
    });
    return promise;
}