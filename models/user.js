'use strict'

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    // User attributes are, firstName, lastName, emailAddress, password
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            // allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            // allowNull: false,
        },
        emailAddress: {
            type: Sequelize.STRING,
            // allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            // allowNull: false,
        }
    }, { sequelize });
    //Has Many relationship side
    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    }
    return User;
}