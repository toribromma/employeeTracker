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

      connection.query(query, [
        this.first_name,
        this.last_name,
        this.role_id,
        this.manager_id,
      ]);
      console.log(`Added employee ${this.first_name} ${this.last_name}.`);
    } catch (err) {
      console.log(err);
    }
  }

  async updateEmployeeRole() {
    try {
      let query =
        `UPDATE employee 
        SET role_id = ?, manager_id = ?  
        WHERE first_name = ? and last_name = ? and id <> 0`;

      connection.query(query, [
        this.role_id,
        this.manager_id,
        this.first_name,
        this.last_name,
     ]);

      console.log(
        `Added employee's role ${this.first_name} ${this.last_name} ${this.role_id}.`
      );

    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Employee;
