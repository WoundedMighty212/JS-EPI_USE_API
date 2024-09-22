import sqlite3 from 'sqlite3';
import {getDB} from './SQLBuilder.js'

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

//get all employee data asnync function
export function SelectAllEMployees(){
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM employees`, [], (err, rows) => {
            if (err) {
                console.error('Error querying data:', err.message);
                reject(err);
            } else {
                console.log('Employees:', rows);
                resolve(rows);
            }
        });
    });
}

//get all employees Relationships data asnync function
export function SelectAllRelationships(){
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM employeesRelationships`, [], (err, rows) => {
            if (err) {
                console.error('Error querying data:', err.message);
                reject(err);
            } else {
                console.log('Employees:', rows);
                resolve(rows); 
            }
        });
    });
}


