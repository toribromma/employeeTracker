// const Database = require("./connection.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./lib/employee");
const Role = require("./lib/role");
const Department = require("./lib/department");
const { NULL } = require("mysql/lib/protocol/constants/types");
const connection = require("./lib/connection");

let pickOptions = [
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
  // "View All Departments",
  "Exit",
];

async function runSearch() {
  var answer = await inquirer.prompt({
    name: "options",
    type: "list",
    message: "What would you like to do?",
    choices: [...pickOptions],
  });

  switch (answer.options) {
    case "Add Employee":
      await getEmployee();
      break;

    case "View All Employees by Department":
      await getAllEmployeesByDepartment();
      break;

    case "Remove Employee":
      console.log("In progress...");
      runSearch();
      break;

    case "View All Employees by Manager":
      console.log("In progress...");
      runSearch();
      break;

    case "Update Employee Role":
      getEmployeeRole();
      break;

    case "Update Employee Manager":
      console.log("In progress...");
      runSearch();
      break;

    case "Remove Role":
      console.log("In progress...");
      runSearch();
      break;

    case "Remove Department":
      console.log("In progress...");
      runSearch();
      break;

    case "View All Employees":
      await getAllEmployees();
      break;

    case "View All Employees by Department":
      await getAllEmployeesByDepartment();
      break;

    case "View All Roles":
      await viewAllRoles();
      break;

    case "Add Department":
      await getDepartment();
      // console.log(value);

      break;

    // case "View All Departments":
    //   getDepartmentNamess();
    //   break;
    case "Add Role":
      addRole();
      break;
    case "Exit":
      process.exit();
  }
  // });
}

async function addRole() {
  let departments = await getDepartmentNames();
  let ids = await getDepartmentIds();
  console.log(departments);
  console.log(ids);

  var role = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What role would you like to add?",
    },
    {
      type: "input",
      name: "salary",
      message: "How much is the salary of the new role?",
    },
    {
      type: "list",
      name: "department",
      choices: [...departments],
      message: "What department does this role belong to?",
    },
  ]);

  var departmentId = ids[departments.indexOf(role.department)];
  role.department = departmentId;

  let query = "INSERT into role (title, salary, department_id) VALUES (?,?,?)";
  console.log(`added role ${role.title}, ${role.salary}`);

  new Promise(function (resolve, reject) {
    if (err) {
      return reject(err);
    }
    resolve(
      connection.query(query, [role.title, role.salary, role.department])
    );
  });
  runSearch();
}

async function getEmployee() {
  var managers = await getManagers();
  var roles = await getRoles();

  var rolesArray = [];
  var roleIdArray = [];

  roles.forEach((role) => {
    rolesArray.push(role.title);
    roleIdArray.push(role.id);
  });

  console.log(roleIdArray);

  var managersArray = [];
  var managerIdArrays = [];
  managers.forEach((manager) => {
    managersArray.push(manager.manager);
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
      message: "Who is the  employee's manager?",
    },
  ]);

  var roleId = await roleIdArray[rolesArray.indexOf(employee.title)];
  var managerId = await managerIdArrays[
    managersArray.indexOf(employee.manager)
  ];

  var newPerson = new Employee(
    employee.first_name,
    employee.last_name,
    roleId,
    managerId
  );

  console.log(newPerson);

  await newPerson.addEmployee();
  await runSearch();
}

async function getDepartment() {
  value = await inquirer.prompt({
    type: "input",
    name: "department",
    message: "What is the name of the department you wish to add?",
  });

  console.log(value.department);
  let newDepartment = await new Department(value.department);
  console.log(newDepartment);
  await newDepartment.addDepartment();
  await runSearch();
}

async function getFirstAndLastName(fullName) {
  let employee = fullName.split(" ");
  if (employee.length == 2) {
    return employee;
  }
  const last_name = employee[employee.length - 1];
  let first_name = " ";
  for (let i = 0; i < employee.length - 1; i++) {
    first_name = first_name + employee[i] + " ";
  }
  return [first_name.trim(), last_name];
}

async function getManagers() {
  query = `SELECT DISTINCT CONCAT(e2.first_name, " ", e2.last_name) 
        AS manager, e1.manager_id FROM employee AS e1
        LEFT JOIN employee as e2
        ON e1.manager_id = e2.role_id
        WHERE e1.manager_id is NOT NULL;`;

  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) {
        return reject(err);
      }

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

async function getRoles() {
  query = `
    SELECT * FROM role
    `;
  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) {
        return reject(err);
      }

      rolesAndRolesIDs = res.map(({ id, title }) => ({ id, title }));
      // console.log(rolesAndRolesIDs)
      resolve(rolesAndRolesIDs);
      if (err) throw err;
    });
  });
}

async function getAllEmployees() {
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
    });
  });
  runSearch();
}

async function getAllEmployeesByDepartment() {
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

  await new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) {
        return reject(err);
      }

      resolve(console.table(res));
    });
  });
  runSearch();
}

async function getDepartmentNames() {
  query = `
    SELECT name
    FROM department
    `;

  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) {
        return reject(err);
      }

      let departmentNames = [];

      res.forEach((element) => {
        departmentNames.push(element.name);
      });

      resolve(departmentNames);
    });
  });
}

async function getDepartmentIds() {
  query = `
    SELECT id
    FROM department
    `;

  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) {
        return reject(err);
      }

      let departmentIDs = [];

      res.forEach((element) => {
        departmentIDs.push(element.id);
      });

      resolve(departmentIDs);
    });
  });
}

async function getEmployeesNames() {
  query = `
    SELECT CONCAT(first_name, " ", last_name) as employee 
    FROM employee`;

  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) {
        return reject(err);
      }

      let employeesNames = [];
      // console.log(res);

      res.forEach((element) => {
        employeesNames.push(element.employee);
      });

      resolve(employeesNames);
    });
  });
}

async function getEmployeeRole() {
  let employees = await getEmployeesNames();
  console.log(employees);

  let roles = await getRoles();
  console.log(roles);

  let roleNames = roles.map((roles) => roles.title);

  console.log(roleNames);

  let employee = await inquirer.prompt([
    {
      type: "list",
      name: "name",
      choices: [...employees],
      message: "Whose role would you like to update?",
    },
    {
      type: "list",
      name: "title",
      choices: [...roleNames],
      message: "What role would you like to have for this employee?",
    },
  ]);

  let firstAndLastNameArray = await getFirstAndLastName(employee.name);
  console.log(firstAndLastNameArray);
  console.log(employee.title);
  let role = await roles.filter((role) => role.title === employee.title);
  console.log(role);

  let newEmployeeRole = await new Employee(
    firstAndLastNameArray[0],
    firstAndLastNameArray[1],
    role[0].id,
    null
  );

  console.log(newEmployeeRole);
  await newEmployeeRole.updateEmployeeRole();
  await runSearch();
}

async function viewAllRoles() {
  let roles = await getRoles();
  let rolesArray = [];
  roles.forEach((element) => {
    elementObject = { Role: element.title };
    rolesArray.push(elementObject);
  });
  console.table(rolesArray);
  runSearch();
}

runSearch();
