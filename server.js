// const Database = require("./connection.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./lib/employee");
const Role = require("./lib/role");
const Department = require("./lib/department");
const { NULL } = require("mysql/lib/protocol/constants/types");
const connection = require("./lib/connection")

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
      await getAllEmployees();
      break;

    case "View All Employees by Department":
      await getAllEmployeesByDepartment();
      break;

    case "View All Roles":
      var roles = await getRoles();
      var rolesArray = [];
      roles.forEach((element) => {
        elementObject = { Role: element.title };
        rolesArray.push(elementObject);
      });
      console.table(rolesArray);
      runSearch();
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
      //   console.log(newRole);
      //   await addRole(newRole);
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
    resolve(
      connection.query(query, [role.title, role.salary, role.department])
    );
    runSearch();
  });
}

async function getEmployee() {

  var managers = await getManagers();
  var roles = await getRoles();

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
        message: "Who is the  employee's manager?",
    },
    ]);

    var roleId = await roleIdArray[rolesArray.indexOf(employee.title)];
    var managerId = await managerIdArrays[managersArray.indexOf(employee.manager)];
    
    var newPerson = new Employee(employee.first_name, employee.last_name, roleId, managerId)

  await newPerson.addEmployee();
  await runSearch();
}

  async function getDepartment() {
    value = await inquirer.prompt({
      type: "input",
      name: "department",
      message: "What is the name of the department you wish to add?",
    });

    console.log(value.department)
    let newDepartment = await new Department(value.department)
    console.log(newDepartment)
    await newDepartment.addDepartment();
    await runSearch();


  }

// async function addRoleId(roleName) {
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

async function getManagers() {
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

async function getRoles() {
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
      runSearch();
    });
  });
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
      resolve(console.table(res));
      runSearch();
    });
  });
}

async function getDepartmentNames() {
  query = `
    SELECT name
    FROM department
    `;

  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
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
      let departmentIDs = [];

      res.forEach((element) => {
        departmentIDs.push(element.id);
      });

      resolve(departmentIDs);
    });
  });
}


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
//   roles = await getRoles();
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
//   let roleId = await addRoleId(employeeInfo.title);

//   let query =
//     "UPDATE employee SET role_id = ?, manager_id = ?  WHERE first_name = ? and last_name = ?";
//   let args = [roleId, null, employee[0], employee[1]];
//   const rows = await connection.query(query, args);
//   console.log(`Added employee ${roleId} ${employee[0]}.`);
//   runSearch();
// }

runSearch();
