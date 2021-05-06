'use strict';

const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model { }
    // User attributes are, firstName, lastName, emailAddress, password
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        emailAddress: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            // allowNull: false,
        }
    }, { sequelize });

    User.associate = (models) => {
        console.log(models)
        User.hasMany(models.Course, {
            as: "Student",
            foreignKey: {
                fieldName: 'userStudentId',
                // allowNull: false,
            },
        });
    };
    return User;
}