INSERT INTO departments(department_name)
VALUES 
('Management'),
('Front end'),
('Back end'),
('HR'),
('Sales'),


INSERT INTO roles(title, salary, department_id)
VALUES
('Team Manager', 150000, 1),
('Front end developer', 100000, 2),
('Back end developer', 120000, 3),
('HR employee', 75000, 4),
('Sales Rep', 100000, 5),

INSERT INTO employees(first_name, last_name, role_id, manager_id) 
VALUES
('Dan', 'Brown', 1),
('Dana', 'Wollin', 2, 1),
('Tristan', 'Miller', 3, 1),
('Summer', 'Wollin', 4, null),
('Luna', 'Brown-Wollin', 5, 2),
