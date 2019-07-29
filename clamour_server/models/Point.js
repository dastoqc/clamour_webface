const Sequelize = require("sequelize");
const index = require("./index").sequelize;

module.exports = index.define("Point", {
    visit_number : {
        type:           Sequelize.INTEGER().UNSIGNED(),
        primaryKey:     true,
        allowNull:      false,
        unique:         true,
        autoIncrement:  true,
        references:     'Visit',
        referencesKey:  'visit_number'
    },

    point_number : {
        type:           Sequelize.INTEGER().UNSIGNED(),
        primaryKey:     true,
        allowNull:      false,
        autoIncrement:  true,
    },

    time_of_start : {
        type:           Sequelize.TIME(),
        allowNull:      false,
    },

    time_since_start : {
        type:           Sequelize.TIME(),
        allowNull:      false,
    },

    time_delta : {
        type:           Sequelize.TIME(),
        allowNull:      false,
    },

    x_position : {
        type:           Sequelize.INTEGER(),
        allowNull:      false,
    },

    x_speed : {
        type:           Sequelize.INTEGER(),
        allowNull:      false,
    },

    y_position : {
        type:           Sequelize.INTEGER(),
        allowNull:      false,
    },

    y_speed : {
        type:           Sequelize.INTEGER(),
        allowNull:      false,
    },

    z_position : {
        type:           Sequelize.INTEGER(),
        allowNull:      false,
    },

    z_speed : {
        type:           Sequelize.INTEGER(),
        allowNull:      false,
    },

    yaw : {
        type:           Sequelize.INTEGER(),
        allowNull:      false,
    },

    yaw_variation : {
        type:           Sequelize.INTEGER(),
        allowNull:      false,
    },
});