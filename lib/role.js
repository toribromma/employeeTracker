const Employee = require("./employee");
const connection = require("./connection");

class Role extends Employee {
  constructor(title, salary, department_id) {
    super();
    this.title = title;
    this.salary = salary;
    this.department_id = department_id;
  }

  async addRole() {
    query = "SELECT * FROM role WHERE role.title=?";
  }
}

module.exports = Role;
