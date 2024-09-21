import {CheckServerAvailabilty} from './apiService.js'
import {GetApiData} from './apiService.js'
import {InitDBandCreateTables} from './SQLBuilder.js'
import {insertBulkEmployees} from './SqlLiteService.js'
import {insertBulkRelationships} from './SqlLiteService.js'

function CallEmployeeandSave(getEmployeeQuery) {
    const employee = GetApiData(getEmployeeQuery)
    .then(response => {

        const employeeArray = response.data.map(item => ({
            name: item.name,         
            employeeID: item.id, 
        }));

        console.log('employee data:', employeeArray);
        insertBulkEmployees(employeeArray);
        return response['total'];
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

        const relationshipsArray = ReporteeData.data.map(item => ({
            RecordID: item.id,         
            managerID: item.managerId, 
            reporteeID: item.reporteeId 
        }));

        console.log('Reportee data:', relationshipsArray);
        insertBulkRelationships(relationshipsArray);
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

                SaveAllEmployees(0,0);

                SaveAllEmployeesRelationships(0,0);

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