const connection = require("./connection");

class Employee {
  constructor(first_name, last_name, role_id, manager_id) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role_id = role_id;
    this.manager_id = manager_id;
  }
  //   super();

  async addEmployee() {
    try {
      let query =
        "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";

      connection.query(
        query,
        this.first_name,
        this.last_name,
        this.role_id,
        this.manager_id
      );
      console.log(`Added employee ${this.first_name} ${this.last_name}.`);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Employee;
