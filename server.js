const Database = require("./connection.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./class");
const mysql = require("mysql");
const { NULL } = require("mysql/lib/protocol/constants/types");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

let filteredManagers = [];
let filteredManagerId = [];
let rolesAndRolesIDs = [];

pickOptions = [
  "View All Employees",
  "View All Employees by Department",
  "View All Employees by Manager",
  "Add Employee",
  "Remove Employee",
  "Update Employee Role",
  "Update Employee Manager",
  "View All Roles",
  "Add Role",
  "Remove Role",
  "Add Department",
  "Remove Department",
  "Exit",
];

function runSearch() {
  inquirer
    .prompt({
      name: "options",
      type: "list",
      message: "What would you like to do?",
      choices: [...pickOptions],
    })
    .then(function (answer) {
      switch (answer.options) {
        case "Add Employee":
          getNewEmployee();
          break;

        // case "View All Employees by Department":
        //   await viewAllEmployeesByDepartment();
        //   break;

        // case "Remove Employee":
        //   console.log("In progress...");
        //   break;

        // case "View All Employees by Manager":
        //   console.log("In progress...");
        //   break;

        // case "Update Employee Role":
        //   updatedEmployee = await getUpdateEmployeeRole();
        //   updateEmployeeRole(updatedEmployee);
        //   break;

        // case "Update Employee Manager":
        //   console.log("In progress...");
        //   break;

        // case "Remove Role":
        //   console.log("In progress...");
        //   break;

        // case "Remove Department":
        //   console.log("In progress...");
        //   break;

        // case "View All Employees":
        //   await viewAllEmployees();
        //   break;

        // case "View All Employees by Department":
        //   await viewAllEmployeesByDepartment();
        //   break;

        // case "View All Roles":
        //   roles = await viewAllRoles();
        //   console.table(...roles);
        //   break;

        // case "Add Department":
        //   value = await addDepartment();
        //   console.log(value.department);
        //   insertDepartment(value.department);
        //   break;

        // case "Add Role":
        //   const newRole = await getRole();
        //   console.log(newRole);
        //   await addRole(newRole);
        //   break;
      }
    });
}

function getNewEmployee() {
  //   runSearch();
  console.log(filteredManagers);
  console.log(rolesAndRolesIDs);
  console.log(filteredManagerId)
  var roles = []
  rolesAndRolesIDs.forEach(element => {
    roles.push(element.title)
  });
  inquirer
    .prompt([
      {
        type: "list",
        name: "title",
        choices: [...roles],
        message: "What is the employee's role?",
      },
      {
        type: "input",
        name: "first_name",
        message: "what is the employee's first name?",
        validate: async (input) => {
          if (input == "" || /\s/.test(input)) {
            return "Please enter first or last name.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "last_name",
        message: "what is the employee's last name?",
        validate: async (input) => {
          if (input == "" || /\s/.test(input)) {
            return "Please enter first or last name.";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "manager",
        choices: [...filteredManagers],
        message: "Who is the employee's manager?",
      },
    ])
    .then(function (answers) {
      addEmployee(answers);
    });
}

// async function getRole() {
//   departments = await viewAllDepartments();
//   return inquirer.prompt([
//     {
//       type: "input",
//       name: "title",
//       message: "What role would you like to add?",
//     },
//     {
//       type: "input",
//       name: "salary",
//       message: "How much is the salary of the new role?",
//     },
//     {
//       type: "list",
//       name: "department",
//       choices: [...departments],
//       message: "What department does this role belong to?",
//     },
//   ]);
// }

// async function getRoleId(roleName) {
//   let query = "SELECT * FROM role WHERE role.title=?";
//   let args = [roleName];
//   const rows = await connection.query(query, args);
//   return rows[0].id;
// }

// async function getEmployeeId(fullName) {
//   let employee = getFirstAndLastName(fullName);
//   let query =
//     "SELECT role_id FROM employee WHERE employee.first_name=? AND employee.last_name=?";
//   let args = [employee[0], employee[1]];
//   const rows = await connection.query(query, args);
//   return rows[0].role_id;
// }

// async function getDepartmentId(departmentName) {
//   let query = "SELECT * FROM department where department.name=?";
//   let args = [departmentName];
//   const rows = await connection.query(query, args);
//   return rows[0].id;
// }

// function getFirstAndLastName(fullName) {
//   // If a person has a space in their first name, such as "Mary Kay",
//   // then first_name needs to ignore that first space.
//   // Surnames generally do not have spaces in them so count the number
//   // of elements in the array after the split and merge all before the last
//   // element.
//   let employee = fullName.split(" ");
//   if (employee.length == 2) {
//     return employee;
//   }

//   const last_name = employee[employee.length - 1];
//   let first_name = " ";
//   for (let i = 0; i < employee.length - 1; i++) {
//     first_name = first_name + employee[i] + " ";
//   }
//   return [first_name.trim(), last_name];
// }

function viewAllManagers() {
  query = `SELECT CONCAT(e2.first_name, " ", e2.last_name) 
        AS manager, e1.manager_id FROM employee AS e1
        LEFT JOIN employee as e2
        ON e1.manager_id = e2.role_id
        WHERE e1.manager_id is NOT NULL;`;

  connection.query(query, function (err, res) {
    // console.log(res)
    var managers = res.map((array) => array.manager);
    // console.log(managers)

    managers.push("null")
    var managerId = res.map((array) => array.manager_id)

    filteredManagerId = managerId.filter((element, index) => {
      return managerId.indexOf(element) === index;
    });
    
    filteredManagers = managers.filter((element, index) => {
      return managers.indexOf(element) === index;
    });
  });
}

function viewAllRoles() {
  query = `
    SELECT * FROM role
    `;
  connection.query(query, function (err, res) {
    rolesAndRolesIDs = res.map(({ id, title }) => ({ id, title }));
    if(err) throw err;
  });
}

// async function viewAllEmployees() {
//   query = `
//     SELECT e1.first_name, e1.last_name, title, salary, name
//     as department, CONCAT(e2.first_name, " ", e2.last_name)
//     AS manager FROM employee AS e1
//     LEFT JOIN employee as e2
//     ON e1.manager_id = e2.role_id
//     INNER JOIN role
//     ON e1.role_id = role.id
//     INNER JOIN department
//     ON role.department_id = department.id;
//     `;
//   rows = await connection.query(query);
//   console.table(rows);
//   runSearch();
// }

// async function viewAllEmployeesByDepartment() {
//   query = `
//     SELECT e1.first_name, e1.last_name, name
//     as department FROM employee AS e1
//     LEFT JOIN employee as e2
//     ON e1.manager_id = e2.role_id
//     INNER JOIN role
//     ON e1.role_id = role.id
//     INNER JOIN department
//     ON role.department_id = department.id
//     `;
//   rows = await connection.query(query);

//   console.table(rows);
// }

// async function viewAllDepartments() {
//   query = `
//     SELECT name from department
//     `;
//   rows = await connection.query(query);
//   department = [];
//   for (const name of rows) {
//     department.push(name.name);
//   }

//   var uniqueDepartment = [...new Set(department)];

//   return uniqueDepartment;
// }

// async function addDepartment() {
//   value = await inquirer.prompt({
//     type: "input",
//     name: "department",
//     message: "What is the name of the department you wish to add?",
//   });
//   return value;
// }

// async function insertDepartment(value) {
//   query = "INSERT INTO department(name) VALUES(?)";

//   connection.query(query, value, function (err, res) {
//     if (err) throw err;
//     console.log(res);
//   });
//   runSearch();
// }

function addEmployee(employeeInfo) {
  // let roleId = getRoleId(employeeInfo.title);
  let roleId = rolesAndRolesIDs.filter(role => role.title === employeeInfo.title)
  console.log(roleId)
  // let managerId = getEmployeeId(employeeInfo.manager);
  let managerIdIndex = filteredManagers.indexOf(employeeInfo.manager)
  let managerId = filteredManagerId[managerIdIndex]
  console.log(managerId)

  let query =
    "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
  let args = [
    employeeInfo.first_name,
    employeeInfo.last_name,
    roleId[0].id,
    managerId,
  ];

  console.log(args)
  connection.query(query, args);

  console.log(
    `Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`
  );
  runSearch();
}

// async function addRole(roleInfo) {
//   let departmentId = await getDepartmentId(roleInfo.department);

//   let query = "INSERT into role (title, salary, department_id) VALUES (?,?,?)";
//   let args = [roleInfo.title, parseInt(roleInfo.salary), departmentId];
//   const rows = await connection.query(query, args);
//   console.log(`added role ${roleInfo.title}, ${roleInfo.salary}`);
//   runSearch();
// }

// runSearch();

// async function viewEmployee() {
//   query = `
//     SELECT CONCAT(first_name, " ", last_name)
//     as employee FROM employee`;
//   rows = await connection.query(query);
//   employees = [];
//   for (const name of rows) {
//     employees.push(name.employee);
//   }
//   return employees;
// }

// async function getUpdateEmployeeRole() {
//   employees = await viewEmployee();
//   roles = await viewAllRoles();
//   return inquirer.prompt([
//     {
//       type: "list",
//       name: "employee",
//       choices: [...employees],
//       message: "Whose role would you like to update?",
//     },
//     {
//       type: "list",
//       name: "title",
//       choices: [...roles],
//       message: "What role would you like to have for this employee?",
//     },
//   ]);
// }

// async function updateEmployeeRole(employeeInfo) {
//   let employee = await getFirstAndLastName(employeeInfo.employee);
//   let roleId = await getRoleId(employeeInfo.title);

//   let query =
//     "UPDATE employee SET role_id = ?, manager_id = ?  WHERE first_name = ? and last_name = ?";
//   let args = [roleId, null, employee[0], employee[1]];
//   const rows = await connection.query(query, args);
//   console.log(`Added employee ${roleId} ${employee[0]}.`);
//   runSearch();
// }
viewAllManagers();
viewAllRoles();
runSearch();
