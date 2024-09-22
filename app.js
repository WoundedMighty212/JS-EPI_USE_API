import {CheckServerAvailabilty} from './apiService.js'
import {GetApiData} from './apiService.js'
import {InitDBandCreateTables} from './SQLBuilder.js'
import {insertBulkEmployees} from './SqlLiteService.js'
import {insertBulkRelationships} from './SqlLiteService.js'
import {SelectAllEMployees} from './SqlLiteService.js'
import {SelectAllRelationships} from './SqlLiteService.js'


function GetReportees(RelationshipArray, employee, employeeArray){
    let reportee;
    let mainFilteredArray = [];
    mainFilteredArray[0] = employee;
    let filteredArray = RelationshipArray.filter(items => 
        employee.id === items.managerId); //find his reportees relationship id
    
    for(let i = 0; i < filteredArray.length; i++){ //find all reportees
        reportee = employeeArray.find(items => 
            filteredArray[i].reporteeId === items.id);//so find reportee
        mainFilteredArray[i + 1] = reportee; //add to list after manager
    }
    
    return mainFilteredArray;
}

function test () {
   const employeeArray = SelectAllEMployees();
   const RelationshipArray = SelectAllRelationships();
   let FilteredObject;
   let MainFilteredArray = [];
   let filteredArray = [];
   let reportee;
   
    let k = 0;
    let employee = employeeArray[k];//set to first employee
    FilteredObject = RelationshipArray // find the first employee relationship
    .find(items => employee.id === items.managerId 
        || employee.id ===  items.reporteeId);

    //determine if first employee is manager or reportee
    if(employee.id === FilteredObject.managerId) { 
    
        MainFilteredArray = 
        GetReportees(RelationshipArray, employee, employeeArray);

    }
    else if(employee.id === FilteredObject.reporteeId) { 
       let managerObject = RelationshipArray // find the first employee manager
        .find(items => 
            FilteredObject.managerId === items.managerId);
       
       MainFilteredArray =
        GetReportees(RelationshipArray, managerObject, employeeArray);
        
    }
    else {
        throw new Error("employee has no relationship!")
    }

   /* for(let i = 0; i < RelationshipArray.length; i++){
            
    }*/
}

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