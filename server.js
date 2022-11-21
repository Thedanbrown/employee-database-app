//bringing in our modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const sequelize = require('./assets/config/connection.js');
//bringing in constructor classes
const department = require('./assets/classes/department.js');
const role = require('./assets/classes/role.js');
const employee = require('./assets/classes/employee.js');

const PORT = process.env.PORT || 3001;

//connecting to mysql using sequilize and a .env file for security
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});




