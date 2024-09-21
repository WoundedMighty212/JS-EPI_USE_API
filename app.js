import {CheckServerAvailabilty} from './apiService.js'
import {GetApiData} from './apiService.js'
import {InitDBandCreateTables} from './SQLBuilder.js'

function RunApp(){
    try{
        InitDBandCreateTables();

        let skipAmount = 0;
        const getEmployeeQuery = 
        `api/employee-sorter/get-employees?limit=500&skip=0`;

        const getReporteeQuery = 
        `api/employee-sorter/get-reporting-relationship?limit=500&skip=${skipAmount}`;

        const serverStatus =  CheckServerAvailabilty()
        .then(Status => {
            if(Status['message'] === 'Service is running'){
                console.log('Server is online')

                const employee = GetApiData(getEmployeeQuery)
                .then(employee => console.log('employee data:', employee));

                const ReporteeRelationship =
                GetApiData(getReporteeQuery)
                .then(Reportee => console.log('Reportee data:', Reportee));

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