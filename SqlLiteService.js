import sqlite3 from 'sqlite3';
import {getDB} from './SQLBuilder.js'

const db = getDB();

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

export function insertIntoRelationships(name, employeeID){
    const stmt = db.prepare(`INSERT INTO employeesRelationships (RecordID, managerID, reporteeID) VALUES (?, ?, ?)`);
    try {
        stmt.run(RecordID, managerID, reporteeID);
        console.log(`Inserted Relationships: ${RecordID} with ID: ${managerID} with sub-boardants: ${reporteeID}`);
    } catch (error) {
        console.error('Error inserting into employeesRelationships:', error);
    } finally {
        stmt.finalize(); 
    }
}

export function insertBulkEmployees(employees) {
    const stmt = db.prepare(`INSERT INTO employees (name, employeeID) VALUES (?, ?)`);

    db.serialize(() => {
        try {
            employees.forEach(({ name, employeeID }) => {
                stmt.run(name, employeeID);
                console.log(`Inserted employee: ${name} with ID: ${employeeID}`);
            });
        } catch (error) {
            console.error('Error inserting into employees:', error);
        } finally {
            stmt.finalize(); 
        }
    });
}

export function insertBulkRelationships(employeesRelationships) {
    const stmt = db.prepare(`INSERT INTO employeesRelationships (RecordID, managerID, reporteeID) VALUES (?, ?, ?)`);

    db.serialize(() => {
        try {
            employees.forEach(({ RecordID, managerID, reporteeID }) => {
                stmt.run(RecordID, managerID, reporteeID);
                console.log(`Inserted Relationships: ${RecordID} with ID: ${managerID} with sub-boardants: ${reporteeID}`);
            });
        } catch (error) {
            console.error('Error inserting into employeesRelationships:', error);
        } finally {
            stmt.finalize(); 
        }
    });
}


export function SelectAllEMployees(){
    db.all(`SELECT * FROM employees`, [], (err, rows) => {
        if (err) {
            console.error('Error querying data:', err.message);
        } else {
            console.log('Employees:', rows);
        }
    });
}

export function SelectAllRelationships(){
    db.all(`SELECT * FROM employeesRelationships`, [], (err, rows) => {
        if (err) {
            console.error('Error querying data:', err.message);
        } else {
            console.log('Employees:', rows);
        }
    });
}

