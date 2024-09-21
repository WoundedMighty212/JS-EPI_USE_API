import {CheckServerAvailabilty} from './apiService.js'
import {GetApiData} from './apiService.js'
import {InitDBandCreateTables} from './SQLBuilder.js'
import {insertBulkEmployees} from './SqlLiteService.js'
import {insertBulkRelationships} from './SqlLiteService.js'

function CallEmployeeandSave(getEmployeeQuery) {
    const employee = GetApiData(getEmployeeQuery)
    .then(employee => {
        console.log('employee data:', employee);
        insertBulkEmployees(employee);
        return employee['total'];
    })
}

function SaveAllEmployees(skipAmount, total) {
    const getEmployeeQuery = 
    `api/employee-sorter/get-employees?limit=500&skip=${skipAmount}`;

    total = CallEmployeeandSave(getEmployeeQuery);
    skipAmount = skipAmount + 500;

    for(let i = 500; i < total; i++){
        const getEmployeeQuery = 
        `api/employee-sorter/get-employees?limit=500&skip=${skipAmount}`;
        CallEmployeeandSave(getEmployeeQuery);
        skipAmount = skipAmount + 500;
    }
}

function CallRelationshipdataAndSave(getReporteeQuery) {
    const ReporteeRelationship = GetApiData(getReporteeQuery)
    .then(ReporteeData => { 
        console.log('Reportee data:', ReporteeData);
        insertBulkRelationships(ReporteeData);
    })
}

function SaveAllEmployeesRelationships(skipAmount, total){
    const getReporteeQuery = 
        `api/employee-sorter/get-reporting-relationship?limit=500&skip=${skipAmount}`;

    total = CallRelationshipdataAndSave(getReporteeQuery);
    skipAmount = skipAmount + 500;

    for(let i = 500; i < total; i++){
        const getReporteeQuery = 
        `api/employee-sorter/get-reporting-relationship?limit=500&skip=${skipAmount}`;
        CallEmployeeandSave(getEmployeeQuery);
        skipAmount = skipAmount + 500;
    }
}


function RunApp(){
    try{
        InitDBandCreateTables();

        let skipAmount = 0;

        const getEmployeeQuery = 
        `api/employee-sorter/get-employees?limit=500&skip=${skipAmount}`;

        const getReporteeQuery = 
        `api/employee-sorter/get-reporting-relationship?limit=500&skip=${skipAmount}`;

        const serverStatus =  CheckServerAvailabilty()
        .then(Status => {
            if(Status['message'] === 'Service is running'){
                console.log('Server is online')

                CallEmployeeandSave();

                CallRelationshipdataAndSave();

            }else{
                console.log('Server is not running or unavailable')
            }
        });  
    }
    catch(error){
        console.error('App-Run Error', error);
    }
}

RunApp();