//bringing in our modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Sequelize = require('sequelize');
const sequelize = require('./assets/config/connection.js');
const Department = require('./assets/models/department.js');
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
            choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee', 'Exit'],
            pageSize: 8
        }
    ]).then((selection) => {
        switch(selection.init) {
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
        case 'Exit':
            console.log('Goodbye');
            process.exit();
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
    const departments = await department.findAll({ raw: true })
    const departmentNames = [];
    departments.forEach((department) => {
        departmentNames.push(department.name)
    })
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
            type: 'list',
            name: 'departmentName',
            message: 'New Role department?',
            choices: departmentNames,
        }
    ]).then((data) => {
        let departmentId = -1;
        departments.forEach((department) => {
            if (department.name === data.departmentName) {
                departmentId = department.id;
            }
        })
        insertRole(data.title, data.salary, departmentId );
    });
}

async function insertRole(newTitle, newSalary, newDepId) {
    try {
    let newR = await role.create({title: (newTitle),salary: (newSalary) ,department_id: (newDepId) });
    console.log(`Successfully added ${newTitle} to Roles`);
    init();
    } catch (err) {
        console.log(err)
    }
}

async function addEmployee() {
    const addR = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Employees First Name?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Employees Last Name?',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'New employees role?',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Who is the employees Manager?',
        }
    ]).then((data) => {
        insertEmployee(data.first_name, data.last_name, data.role_id, data.manager_id);
    });
}

async function insertEmployee(newFirstName, newLastName, newRoleId, newManagerId) {
    try {
    let newR = await employee.create({first_name: (newFirstName), last_name: (newLastName) , role_id: (newRoleId), department_id: (newManagerId) });
    console.log(`Successfully added ${newFirstName} ${newLastName} to Employees`);
    init();
    } catch (err) {
        console.log(err)
    }
}

async function viewDepartments() {
    const allDepartments = await department.findAll({ raw: true })
    console.table(allDepartments);
    init();
}

async function viewEmployees() {
    const allDepartments = await employee.findAll({ raw: true })
    console.table(allDepartments);
    init();
}

async function viewRoles() {
    const allDepartments = await role.findAll({ raw: true })
    console.table(allDepartments);
    init();
}


init();
// 



