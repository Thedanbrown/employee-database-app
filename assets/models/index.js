const Employee = require('./employee');
const Role = require('./role.js');
const Department = require('./department');
//creates relationships between different tables for sequelize using the models
Department.hasOne(Role, {
    foreignKey: 'department_id',
    onDelete: 'CASCADE',
});

Role.belongsTo(Department, {
    foreignKey: 'department_id',
});

Role.hasOne(Employee, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE',
})

Employee.belongsTo(Role, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE',
});



module.exports = { Employee, Role, Department };