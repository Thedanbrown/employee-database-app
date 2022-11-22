//bringing in our modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Sequelize = require('sequelize');
const sequelize = require('./assets/config/connection.js');
//bringing in constructor classes
const department = require(__dirname + '/assets/models/department.js');
const role = require(__dirname + '/assets/models/role.js');
const employee = require(__dirname + '/assets/models/employee.js');

const PORT = process.env.PORT || 3001;

// connecting to mysql using sequilize and a .env file for security
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

// const db = mysql.createConnection(
//     {
//     host: 'localhost',
//     user: 'root',
//     password: 'admin',
//     database: 'employee_db'
//     },
// );

function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'Please choose an option below',
            choices: ['View Departments', 'View Roles', 'View Employees', 'View Department Budget', 'Update Employee','Add Department', 'Add Role', 'Add Employee', 'Delete Department', 'Delete Role', 'Delete Employee', 'Exit'],
            pageSize: 12
        }
    ]).then((selection) => {
        switch(selection.init) {
        case 'Exit Employee Tracker':
            console.log('Goodbye');
            break;
        case 'Update Employee':
            updateEmployee();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'View Departments':
            viewDepartments();
            break;
        case 'View Employees':
            viewEmployees();
            break;
        case 'View Roles':
            viewRoles();
            break;
        case 'View Department Budget':
            viewDepartmentBudget();
            break;
        case 'Delete Employee':
            deleteEmployee();
            break;
        case 'Delete Department':
            deleteDepartment();
            break;
        case 'Delete Role':
            deleteRole();
            break;
        case 'Exit':
            exit();
            break;
        }
    })
}

async function addDepartment() {
    const addDep = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'New Department Name?',
            default: () => {},
        }
    ]).then((data) => {
        insertDepartment(data.name);
    });
}

async function insertDepartment(newDep) {
    try {
    let newDepartment = await department.create({name: (newDep)});
    console.log(`Successfully added ${newDep} to Departments`);
    init();
    } catch (err) {
        console.log('Please enter a valid department')
    }
}

async function addRole() {
    const addR = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'New Role Title?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'New Role Salary?',
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'New Role department number?',
        }
    ]).then((data) => {
        insertRole(data.title, data.salary, data.deparment_id);
    });
}

async function insertRole(newTitle, newSalary, newDep) {
    try {
    let newR = await role.create({title: (newTitle), salary: (newSalary), department_id: (newDep)});
    console.log(`Successfully added ${newTitle} to Roles`);
    init();
    } catch (err) {
        console.log(err)
    }
}



init();


