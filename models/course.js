'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: 'Description is required'
        }
      }
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {});

  Course.associate = (models) => {
      Course.belongsTo(models.User, { 
        as: 'user',
        foreignKey: {
          fieldName: 'userId', 
          allowNull: false
        }
      });
  };
  
  return Course;
};