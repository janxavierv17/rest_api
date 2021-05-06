'use strict';

const { Model, DataTypes, Sequelize } = require("sequelize");

// Course has 1-to-1 association
module.exports = (sequelize) => {
    class Course extends Model { }
    // Course attributes are, title, description, estimatedTime, materialsNeeded
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            // allowNull: false,
        },
        estimatedTime: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        materialsNeeded: {
            type: DataTypes.STRING,

        }
    }, { sequelize });
    Course.associate = (models) => {
        // A course that can only be associated with one user.
        console.log(models)
        Course.belongsTo(models.User, {
            as: "Student",
            foreignKey: {
                fieldName: 'userStudentId',
                // allowNull: false,
            }
        })
    }
    return Course;
}