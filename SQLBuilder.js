import sqlite3 from 'sqlite3';//sql lite 3rd party tools

//create or connect to sql db
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

//delete all data for employees. for this test example it should run everything as a new app install
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

//delete all data for employeesRelationships. for this test example it should run everything as a new app install
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

//create table for employees objects
function CreateEmployeeTable(){
    //table object sql command
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


//create table for employees relationships objects
function CreateEmployeeRelationshipsTable(){
    //table object sql command
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

// reset data to new app instance and create tables is neccesary
export function InitDBandCreateTables(){
    //reset table information
    deleteAllEmployees();
    deleteAllEmployeesRelationships();
    //if tables do not exist create tables
    CreateEmployeeTable();
    CreateEmployeeRelationshipsTable();
}

//expose the DB for the SqlLiteService.js class
export function getDB (){
    return db;
}
