const mysql = require('mysql2');

// database connection
var connection

// ======================= Initialization of the database ======================= //
module.exports.init = async function () {
    try {
        await connect();
        await create_db();
    }
    catch (err){
        console.log(`Error while initializing the database :\n${err}`)
    }
}

// Create the connection to database
connect = async function () {
    return connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: 'root',
    })
}

// Initialize the database tables if they are not initialized yet
create_db = function () {
    var promise = new Promise((resolve, reject) => {
        connection.query(`CREATE DATABASE IF NOT EXISTS \`${database_name}\`;`, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; resolve()
        });
    });
    return promise;
}

// Using the database
use_db = function () {
    var promise = new Promise((resolve, reject) => {
        connection.query(`USE \`${database_name}\`;`, function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }; resolve()
        });
    });
    return promise;
}

// Initializat the database tables if they are not initialized yet


// Close the connection to database
module.exports.close = async function () {
    return connection.close();
}


