const mysql = require('mysql2');
const config = require('../../configuration/database.json');
const initializer = require('./query_init');
const tags = require('./table_tags');

// Database connection
var connection;

// Initialize the database
module.exports.init = async function () {
    try {
        connection = await initializer.db_connect();
        await initializer.db_create();
        await initializer.db_use();
        await tags.init_table(connection);
        console.log(`Database '${config.database}' set and ready to be used`.green);
    }
    catch (err) {
        console.log(`Error while initializing the database :\n${err}`.red);
    }
    return;
};

// Close the connection to database
module.exports.close = async function () {
    return connection.close();
};

// Table query accessors
module.exports.query = {
    tags: tags,
};