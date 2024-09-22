import {CheckServerAvailabilty} from './apiService.js'
import {GetApiData} from './apiService.js'
import {InitDBandCreateTables} from './SQLBuilder.js'
import {insertBulkEmployees} from './SqlLiteService.js'
import {insertBulkRelationships} from './SqlLiteService.js'
import {SelectAllEMployees} from './SqlLiteService.js'
import {SelectAllRelationships} from './SqlLiteService.js'

function FilterList(RelationshipArray, employeeArray, employee) {
    let MainFilteredArray = [];
    let FilteredObject;
    FilteredObject = RelationshipArray // find the first employee relationship
        .find(items => employee.employeeID === items.managerId 
            || employee.employeeID ===  items.reporteeId);

        if (!FilteredObject) {  // Added a check for undefined.
            throw new Error("could not find match");
        }

        //determine if first employee is manager or reportee
        if(employee.employeeID === FilteredObject.managerId) { 
        
            MainFilteredArray = 
            GetReportees(RelationshipArray, employee, employeeArray);

        }
        else if(employee.employeeID === FilteredObject.reporteeId) { //is first employee reportee
        let managerObject = RelationshipArray // find the first employee manager
            .find(items => 
                FilteredObject.managerId === items.managerId);
        
        MainFilteredArray =
            GetReportees(RelationshipArray, managerObject, employeeArray);
            
        }
        else { // there is no relationship
            throw new Error("employee has no relationship!")
        }

    return MainFilteredArray;
}

function GetReportees(RelationshipArray, employee, employeeArray){
    let reportee;
    let mainFilteredArray = []; 
    mainFilteredArray.push(employee); //add manager first
    let filteredArray = RelationshipArray.filter(items => 
        employee.employeeID === items.managerId); //find his reportees relationship id
    
    for(let i = 0; i < filteredArray.length; i++){ //find all reportees
        reportee = employeeArray.find(items => 
            filteredArray[i].reporteeId === items.employeeID);//so find reportee
            mainFilteredArray.push(reportee); //add reportee to list after manager
    }

    return mainFilteredArray; //return list of managers
}

function SortList () {
   const employeeArray = SelectAllEMployees();
   const RelationshipArray = SelectAllRelationships();
   let MainFilteredArray = [];

   for(let i = 0; i < employeeArray.length; i++){
    let employee = employeeArray[i];//set to first employee
        if(MainFilteredArray.length > 0){
          const employeeExist = MainFilteredArray.find(item => 
                employee.employeeID === item.managerId
            || employee.employeeID === item.reporteeId)
            if(employeeExist){
                //do not add to list go to next employee
                continue;  // Skip this iteration
            }
            else{
                //find new manager and reportee and add to list
                const filteredList = FilterList(RelationshipArray, employeeArray, employee);
                MainFilteredArray = MainFilteredArray.concat(filteredList); // add all employees to list with append
            }
        }
        else{
            //find new manager and reportee and add to list
            const filteredList = FilterList(RelationshipArray, employeeArray, employee);
            MainFilteredArray = MainFilteredArray.concat(filteredList); // add all employees to list with append
        }
   }
   //post to server: 
   console.log(PostToServer('api/employee-sorter/test', MainFilteredArray));
}

function CallEmployeeandSave(getEmployeeQuery) {
    const employee = GetApiData(getEmployeeQuery)
    .then(response => {

        const employeeArray = response.data.map(item => ({
            name: item.name,         
            employeeID: item.id, 
        }));

        //console.log('employee data:', employeeArray);
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

        //console.log('Reportee data:', relationshipsArray);
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

                SortList();

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