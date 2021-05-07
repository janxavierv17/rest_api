'use strict'

const Sequelize = require('sequelize');

// Course has 1-to-1 association
module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    // Course attributes are, title, description, estimatedTime, materialsNeeded
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A title is required.",
                },
                notEmpty: {
                    msg: "Please provide the title of the course.",
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please provide the description of the course.",
                },
                notEmpty: {
                    msg: "A descrption of the course is required."
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
            // allowNull: false,
        },
        materialsNeeded: {
            type: Sequelize.STRING,

        }
    }, { sequelize });
    //belongsTo side of relationship
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            },
        });
    }
    return Course;
}