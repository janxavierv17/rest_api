'use strict'

const { Sequelize, DataTypes } = require('sequelize');

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
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: "The email you've entered already exists."
            },
            validate: {
                notNull: {
                    msg: "An email is required."
                },
                isEmail: {
                    msg: "Please provide a valid email."
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A password is required.",
                },
                notEmpty: {
                    msg: "Please provide a password.",
                }
            }
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