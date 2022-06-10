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

// let filteredManagers = [];
// let filteredManagerId = [];
// let rolesAndRolesIDs = [];

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

async function runSearch() {
  var answer = await inquirer.prompt({
    name: "options",
    type: "list",
    message: "What would you like to do?",
    choices: [...pickOptions],
  });
  // .then(function (answer) {
  switch (answer.options) {
    case "Add Employee":
      await getNewEmployee();

      break;

    case "View All Employees by Department":
      await viewAllEmployeesByDepartment();
      break;

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

    case "View All Employees":
      await viewAllEmployees();
      break;

    case "View All Employees by Department":
      await viewAllEmployeesByDepartment();
      break;

    case "View All Roles":
      var roles = await viewAllRoles();
      var rolesArray = [];
      roles.forEach((element) => {
        elementObject = { Role: element.title };
        rolesArray.push(elementObject);
      });
      console.table(rolesArray);
      runSearch();
      break;

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
  // });
}

async function getNewEmployee() {
  var managers = await viewAllManagers();
  var roles = await viewAllRoles();

  // console.log(managers)
  // console.log(roles)

  await addEmployee(managers, roles);
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

async function viewAllManagers() {
  query = `SELECT DISTINCT CONCAT(e2.first_name, " ", e2.last_name) 
        AS manager, e1.manager_id FROM employee AS e1
        LEFT JOIN employee as e2
        ON e1.manager_id = e2.role_id
        WHERE e1.manager_id is NOT NULL;`;

  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      var managersAndManagersID = [];

      res.forEach((manager) => {
        var object = {
          manager: manager.manager,
          id: manager.manager_id,
        };
        managersAndManagersID.push(object);
      });

      resolve(managersAndManagersID);
    });
  });
}

async function viewAllRoles() {
  query = `
    SELECT * FROM role
    `;
  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      rolesAndRolesIDs = res.map(({ id, title }) => ({ id, title }));
      // console.log(rolesAndRolesIDs)
      resolve(rolesAndRolesIDs);
      if (err) throw err;
    });
  });
}

async function viewAllEmployees() {
  query = `
    SELECT e1.first_name, e1.last_name, title, salary, name
    as department, CONCAT(e2.first_name, " ", e2.last_name)
    AS manager FROM employee AS e1
    LEFT JOIN employee as e2
    ON e1.manager_id = e2.role_id
    INNER JOIN role
    ON e1.role_id = role.id
    INNER JOIN department
    ON role.department_id = department.id;
    `;

  await new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      resolve(console.table(res));
      runSearch();
    });
  });
}

async function viewAllEmployeesByDepartment() {
  query = `
    SELECT e1.first_name, e1.last_name, name
    as department FROM employee AS e1
    LEFT JOIN employee as e2
    ON e1.manager_id = e2.role_id
    INNER JOIN role
    ON e1.role_id = role.id
    INNER JOIN department
    ON role.department_id = department.id
    `;

  new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      resolve(console.table(res));
      runSearch();
    });
  });
}

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

async function addEmployee(managers, roles) {
  // console.log(managers)
  var rolesArray = [];
  roles.forEach((role) => {
    rolesArray.push(role.title);
  });

  var roleIdArray = [];
  roles.forEach((role) => {
    roleIdArray.push(role.id);
  });

  var managersArray = [];
  managers.forEach((manager) => {
    managersArray.push(manager.manager);
  });

  var managerIdArrays = [];
  managers.forEach((manager) => {
    managerIdArrays.push(manager.id);
  });

  console.log(managerIdArrays);

  var employee = await inquirer.prompt([
    {
      type: "list",
      name: "title",
      choices: [...rolesArray],
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
      choices: [...managersArray],
      message: "Who is the employee's manager?",
    },
  ]);

  console.log(employee);

  var roleId = roleIdArray[rolesArray.indexOf(employee.title)];
  var managerId = managerIdArrays[managersArray.indexOf(employee.manager)];

  let query =
    "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
  let args = [employee.first_name, employee.last_name, roleId, managerId];

  console.log(args);
  connection.query(query, args);

  console.log(`Added employee ${employee.first_name} ${employee.last_name}.`);
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
// viewAllManagers();
// viewAllRoles();
runSearch();
