import sqlite3 from 'sqlite3'; //sql lite 3rd party tools
import {getDB} from './SQLBuilder.js' //this constructs sql db

//get the connected db
const db = getDB();

//a single function call if you only need to insert one record --not needed for app? this was just a insert templete i made to build bulk insert off of.
export function insertIntoEmployees(name, employeeID){
    const stmt = db.prepare(`INSERT INTO employees (name, employeeID) VALUES (?, ?)`);
    try {
        stmt.run(name, employeeID);
        console.log(`Inserted employee: ${name} with ID: ${employeeID}`);
    } catch (error) {
        console.error('Error inserting into employees:', error);
    } finally {
        stmt.finalize(); 
    }
}
//a single function call if you only need to insert one record --not needed for app? this was just a insert templete i made to build bulk insert off of.
export function insertIntoRelationships(name, employeeID){
    const stmt = db.prepare(`INSERT INTO employeesRelationships (RecordID, managerID, reporteeID) VALUES (?, ?, ?)`);
    try {
        stmt.run(RecordID, managerID, reporteeID);
        //console.log(`Inserted Relationships: ${RecordID} with ID: ${managerID} with sub-boardants: ${reporteeID}`);
    } catch (error) {
        console.error('Error inserting into employeesRelationships:', error);
    } finally {
        stmt.finalize(); 
    }
}

//insert a array of employee data for sql lite db
export function insertBulkEmployees(employees) {
    const stmt = db.prepare(`INSERT INTO employees (name, employeeID) VALUES (?, ?)`); //sql statement for insert

    db.serialize(() => {
        try {
            employees.forEach(({ name, employeeID }) => { //save every employee in array
                stmt.run(name, employeeID); //exute command for single record
                console.log(`Inserted employee: ${name} with ID: ${employeeID}`); //log progress
            });
        } catch (error) {
            console.error('Error inserting into employees:', error);
        } finally {
            stmt.finalize(); //dispose object
        }
    });
}

//insert a array of employees Relationships data for sql lite db
export function insertBulkRelationships(employeesRelationships) {
    const stmt = db.prepare(`INSERT INTO employeesRelationships (RecordID, managerID, reporteeID) VALUES (?, ?, ?)`);

    db.serialize(() => {
        try {
            employeesRelationships.forEach(({ RecordID, managerID, reporteeID }) => { //save every employee in array
                stmt.run(RecordID, managerID, reporteeID);  //exute command for single record
               console.log(`Inserted Relationships: ${RecordID} with ID: ${managerID} with sub-boardants: ${reporteeID}`); //log progress
            });
        } catch (error) {
            console.error('Error inserting into employeesRelationships:', error);
        } finally {
            stmt.finalize(); //dispose object
        }
    });
}
// Function to retrieve all employee data from the database.
// This function is asynchronous and returns a Promise that resolves with the employee data or rejects with an error.
// The function utilizes SQLite's `db.all` method to execute the SQL query.
// Parameters: None
// Returns: Promise that resolves to an array of employee objects or rejects with an error.
//get all employee data asnync function
export function SelectAllEMployees(){
    return new Promise((resolve, reject) => {
         // Execute SQL query to select all employees from the 'employees' table
        db.all(`SELECT * FROM employees`, [], (err, rows) => {
            // Log the error message if there is an issue with the query
            if (err) {
                console.error('Error querying data:', err.message);
                 // Reject the Promise with the error
                reject(err);
            } else {
                // Log the retrieved employee data for debugging purposes
                console.log('Employees:', rows);
                // Resolve the Promise with the array of employee data
                resolve(rows);
            }
        });
    });
}

// Function to retrieve all employee data from the database.
// This function is asynchronous and returns a Promise that resolves with the employee data or rejects with an error.
// The function utilizes SQLite's `db.all` method to execute the SQL query.
// Parameters: None
// Returns: Promise that resolves to an array of employee objects or rejects with an error.
//get all employees Relationships data asnync function
export function SelectAllRelationships(){
     // Execute SQL query to select all employees Relationships from the 'employees' table
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM employeesRelationships`, [], (err, rows) => {
            // Log the error message if there is an issue with the query
            if (err) {
                console.error('Error querying data:', err.message);
                 // Reject the Promise with the error
                reject(err);
            } else {
                // Log the retrieved employee data for debugging purposes
                console.log('Employees:', rows);
                // Resolve the Promise with the array of employeesRelationships data
                resolve(rows); 
            }
        });
    });
}


