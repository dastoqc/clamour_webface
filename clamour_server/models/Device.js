const Sequelize = require("sequelize");
const index = require("./index").sequelize;

module.exports = index.define("Device", {
    tag_id : {
        type:           Sequelize.SMALLINT().UNSIGNED,
        allowNull:      false,
        unique:         true,
        references:     'Visit',
        referencesKey:  'tag_id'
    },

    ip_address : {
        type:           Sequelize.INTEGER().UNSIGNED,
        allowNull:      false,
        unique:         true,
    },

    date : {
        type:           Sequelize.CHAR(20),
        allowNull:      true
    },
});