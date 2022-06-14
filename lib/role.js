const Employee = require("./employee")
class Role extends Employee {
  constructor(title, salary, department_id) {
    this.title = title;
    this.salary = salary;
    this.department_id = department_id;
   
  }
//   super();
}

module.exports = Role;
