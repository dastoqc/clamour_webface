const Sequelize = require("sequelize");
const index = require("./index");

module.exports = index.define("Visit", {
    visit_number : {
        type:           Sequelize.INTEGER(),
        primaryKey:     true,
        allowNull:      false,
        unique:         true,
        autoIncrement:  true,
        references:     'Point',
        referencesKey:  'visit_number'
    },

    tag_id : {
        type:           Sequelize.SMALLINT().UNSIGNED(),
        allowNull:      false,
        unique:         true,
        references:     'Device',
        referencesKey:  'tag_id'
    },

    date : {
        type:           Sequelize.DATE(),
        allowNull:      false
    },

    time : {
        type:           Sequelize.TIME(),
        allowNull:      false
    },

    mode : {
        type:           Sequelize.CHAR(5),
        allowNull:      false
    }
});