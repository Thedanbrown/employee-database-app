//bringing in our modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const sequelize = require('.assets/config/connection');
//bringing in constructor classes
const Department = require(__dirname + '/assets/classes/Department.js');
const Role = require(__dirname + '/assets/classes/Role.js');
const Employee = require(__dirname + '/assets/classes/Employee.js');

const PORT = process.env.PORT || 3001;

//connecting to mysql using sequilize and a .env file for security
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});




