'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Full name is required'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Full name is required'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Email address is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        }
      }
    }
  }, {});

  User.associate = (models) => {
    User.hasMany(models.Course, { foreignKey: 'userId' });
  };
  
  return User;
};