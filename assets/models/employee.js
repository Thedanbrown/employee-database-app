const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Role = require('./role')

class Employee extends Model {}
//creating the employee model
Employee.init(
    {
        id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
        first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
        last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
        role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }
    },
        manager_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'id'
        }
    },
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'employee',
});

module.exports = Employee;