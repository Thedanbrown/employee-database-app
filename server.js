//bringing in our modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Sequelize = require('sequelize');
const sequelize = require('./assets/config/connection.js');
//bringing in sequilize models  classes
const { Department , Role, Employee } = require('./assets/models');

const PORT = process.env.PORT || 3001;

// connecting to mysql using sequilize and a .env file for security
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
//Startup function to run app
async function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'Please choose an option below',
            choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employees Role', 'Exit'],
            pageSize: 8,
            default: 0
        }
    ]).then((selection) => {
        switch(selection.init) {
        case 'Update Employees Role':
            updateEmployeesRole();
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
// add functions for each model
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
    let newDepartment = await Department.create({name: (newDep)});
    console.log(`Successfully added ${newDep} to Departments`);
    init();
    } catch (err) {
        console.log('Please enter a valid department')
    }
}

async function addRole() {
    const departments = await Department.findAll({ raw: true })
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
            choices: departmentNames
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
    let newR = await Role.create({title: (newTitle),salary: (newSalary) ,department_id: (newDepId) });
    console.log(`Successfully added ${newTitle} to Roles`);
    init();
    } catch (err) {
        console.log(err)
    }
}

async function addEmployee() {
    const roles = await Role.findAll({ raw: true })
    const roleNames = [];
    roles.forEach((role) => {
        roleNames.push(role.title)
    });
    const managers = await Employee.findAll({ raw: true })
    const managerNames = [];
    managers.forEach((employee) => {
        managerNames.push(`${employee.first_name}  ${employee.last_name}`)
    });
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
            type: 'list',
            name: 'role',
            message: 'New employees role?',
            choices: roleNames,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employees Manager?',
            choices: managerNames,
        }
    ]).then((data) => {
        let roleId = -1;
        roles.forEach((role) => {
            if (role.title === data.role) {
                roleId = role.id;
            }
        })
        let managerId = null;
        managers.forEach((employee) => {
            const employeeFullName = `${employee.first_name}  ${employee.last_name}`
            if (employeeFullName === data.manager) {
                managerId = employee.id;
            }
        })
        insertEmployee(data.first_name, data.last_name, roleId, managerId);
    });
}

async function insertEmployee(newFirstName, newLastName, newRoleId, newManagerId) {
    try {
    let newR = await Employee.create({first_name: (newFirstName), last_name: (newLastName) , role_id: (newRoleId), manager_id: (newManagerId) });
    console.log(`Successfully added ${newFirstName} ${newLastName} to Employees`);
    init();
    } catch (err) {
        console.log(err)
    }
}
// view functions
async function viewDepartments() {
    const allDepartments = await Department.findAll({ raw: true })
    console.table(allDepartments);
    init();
}

async function viewEmployees() {
    const allDepartments = await Employee.findAll({ attributes: { exclude: ['role_id', 'manager_id']}, raw: true, include: [{ model: Role, attributes: ['title', 'salary'] }] })
    console.table(allDepartments);
    init();
}

async function viewRoles() {
    const allDepartments = await Role.findAll({ attributes: { exclude: ['department_id', 'manager_id']}, raw: true, include: [{ model: Department, attributes: ['name']}] })
    console.table(allDepartments);
    init();
}
// update employee role functions
async function updateEmployeesRole() {
    const employees = await Employee.findAll({ raw: true })
    const employeeNames = [];
    employees.forEach((employee) => {
        employeeNames.push(`${employee.first_name}  ${employee.last_name}`)
    });
    const roles = await Role.findAll({ raw: true })
    const roleNames = [];
    roles.forEach((role) => {
        roleNames.push(role.title)
    });
    const updateEmpRole = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeName',
            message: 'Which employee would you like to update?',
            choices: employeeNames
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'what is their new role?',
            choices: roleNames
        }
    ]).then((data) => {
        let employeeId = -1;
        employees.forEach((employee) => {
            const employeeFullName = `${employee.first_name}  ${employee.last_name}`
            if (employeeFullName === data.employeeName) {
                employeeId = employee.id;
            } 
        })
        let roleId = -1;
        roles.forEach((role) => {
            if (role.title === data.newRole) {
                roleId = role.id;
            }
        })
        insertUpdatedRole(employeeId, roleId);
        console.log('Updated role')
        init();
    });
}

async function insertUpdatedRole(empId, rId) {
try{
    const employeeToUpdate = await Employee.findByPk(empId);
    employeeToUpdate.role_id =  rId;
    let updatedRole = await employeeToUpdate.save();
} catch (err) {
console.log(err)
}
}

init();
// 



