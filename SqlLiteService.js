import sqlite3 from sqlite3

export function SelectAllEMployees(){
    db.all(`SELECT * FROM employees`, [], (err, rows) => {
        if (err) {
            console.error('Error querying data:', err.message);
        } else {
            console.log('Employees:', rows);
        }
    });
}



