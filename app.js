import {CheckServerAvailabilty} from './apiService.js'
import {GetApiData} from './apiService.js'

function RunApp(){
    try{
        const getEmployeeQuery = 
        `api/employee-sorter/get-employees?limit=500&skip=0`;
        const getReporteeQuery = 
        `api/employee-sorter/get-reporting-relationship?limit=500&skip=0`;
        
        const serverStatus =  CheckServerAvailabilty()
        .then(Status => console.log('Server Status:', Status));

        const employee = GetApiData(getEmployeeQuery)
        .then(employee => console.log('employee data:', employee));

        const ReporteeRelationship =
        GetApiData(getReporteeQuery)
        .then(Reportee => console.log('Reportee data:', Reportee));
    }
    catch(error){
        console.error('Error fetching server status:', error);
    }
}

RunApp();