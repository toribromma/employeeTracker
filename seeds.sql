DROP DATABASE IF EXISTS employee_trackDB;

CREATE DATABASE employee_trackDB;

USE employee_trackDB;

CREATE TABLE `department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `department_id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `department_id` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=u
tf8mb4_0900_ai_ci;

CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `manager_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
  -- CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ### Alternative way to insert more than one row
INSERT INTO department (name)
VALUES ("Sales"), 
("Engineering"), 
("Finance"),
("Legal");

INSERT INTO role (title, salary, department_id) 
Values ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id) 
Values ("Sales Person", 80000, 1);


INSERT INTO role (title, salary, department_id) 
Values ("Lead Engineer", 150000, 2);

INSERT INTO role (title, salary, department_id) 
Values ("Software Engineer", 100000, 2);

INSERT INTO role (title, salary, department_id) 
Values ("Accountant", 125000, 3);

INSERT INTO role (title, salary, department_id) 
Values ("Legal Team Lead", 275000, 4);
INSERT INTO role (title, salary, department_id) 
Values ("Lawyer", 200000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Kobe", "Bryant", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Anthony", "Davis", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Karl", "Malone", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Lebron", "James", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Reggie", "Miller", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Lamar", "Odom", 4, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Dwayne", "Wade", 5, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Kevin", "Garnett", 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Wilt", "Chamberlain", 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Shaquille", "Oneal", 7, 6);










