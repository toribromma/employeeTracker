const Employee = require("./employee")
const connection = require("./connection")

class Department extends Employee {
  constructor(name) {
      super();
    this.name = name;
  }

  async addDepartment() {
    let query = "INSERT INTO department(name) VALUES(?)";
    console.log(this.name)
    connection.query(query, this.name, function (err, res) {
      if (err) throw err;
      console.log(res);
    });
    // runSearch();
  }
}

module.exports = Department;
