import sqlite3 from sqlite3

function createSQLliteDB(){
    const db = new sqlite3.Database('./mydatabase.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            return false;
        } else {
            console.log('Connected to the SQLite database.');
            return true;
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
        ManagerID TEXT,
        ReporteeID TEXT
        employeeID TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully.');
        }
    });
}

export function InitDBandCreateTables(){
    if(createSQLliteDB()) {
        CreateEmployeeTable();
        CreateEmployeeRelationshipsTable();
    }
}

