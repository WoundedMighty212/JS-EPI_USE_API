import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

function deleteAllEmployees() {
    const sql = `DELETE FROM employees`;
    db.run(sql, function(err) {
        if (err) {
            console.error('Error deleting employees:', err.message);
        } else {
            console.log(`Deleted ${this.changes} row(s) from employees table.`);
        }
    });
}

function deleteAllEmployeesRelationships() {
    const sql = `DELETE FROM employeesRelationships`;

    db.run(sql, function(err) {
        if (err) {
            console.error('Error deleting employeesRelationships:', err.message);
        } else {
            console.log(`Deleted ${this.changes} row(s) from employeesRelationships table.`);
        }
    });
}

function CreateEmployeeTable(){
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        employeeID TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully.');
        }
    });
}

function CreateEmployeeRelationshipsTable(){
    db.run(`CREATE TABLE IF NOT EXISTS employeesRelationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        managerID TEXT,
        reporteeID TEXT,
        RecordID TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully.');
        }
    });
}

export function InitDBandCreateTables(){
    deleteAllEmployees();
    deleteAllEmployeesRelationships();

    CreateEmployeeTable();
    CreateEmployeeRelationshipsTable();
}

export function getDB (){
    return db;
}
