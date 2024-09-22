//call dependacies from other modules
import {CheckServerAvailabilty} from './apiService.js'
import {GetApiData} from './apiService.js'
import {InitDBandCreateTables} from './SQLBuilder.js'
import {insertBulkEmployees} from './SqlLiteService.js'
import {insertBulkRelationships} from './SqlLiteService.js'
import {SelectAllEMployees} from './SqlLiteService.js'
import {SelectAllRelationships} from './SqlLiteService.js'
import {PostToServer} from './apiService.js'

//this method finds the manager and seperates the manager and his reportees. and then add them in the right order. --helper method
function FilterList(RelationshipArray, employeeArray, employee) {
    let MainFilteredArray = [];
    let FilteredObject; // this is the object is the manager or reportee.
    FilteredObject = RelationshipArray // find the first employee relationship
        .find(items => employee.employeeID === items.managerId 
            || employee.employeeID ===  items.reporteeId);// find out if the employee is manager or reportee

        if (!FilteredObject) {  // Added a check for undefined.
            throw new Error("could not find match");
        }

        //determine if first employee is manager or reportee through FilteredObject
        if(employee.employeeID === FilteredObject.managerId) { 
        
            MainFilteredArray = 
            GetReportees(RelationshipArray, employee, employeeArray);

        }
        else if(employee.employeeID === FilteredObject.reporteeId) { //FilteredObject = reportee now find his manager code block
        let managerObject = RelationshipArray // find the employee manager
            .find(items => 
                FilteredObject.managerId === items.managerId);// find the employee manager
        
        MainFilteredArray =
            GetReportees(RelationshipArray, managerObject, employeeArray); // now lets find manager's reportees now that who the manager is
            
        }
        else { // there is no relationship found
            throw new Error("employee has no relationship!")
        }

    return MainFilteredArray;
}
//this function is there to find all the reportees belonging to a single manager --helper method
function GetReportees(RelationshipArray, employee, employeeArray){
    let reportee; //this is the reportee object
    let mainFilteredArray = []; // the full sorted list after finding reportees, this will be consumed by the bigger sorted list with the same name
    mainFilteredArray.push(employee); //add manager first
    let filteredArray = RelationshipArray.filter(items => 
        employee.employeeID === items.managerId); //find his reportees relationship id, basically find all the reportees
    
    for(let i = 0; i < filteredArray.length; i++){ //loop through all reportees and add to list
        reportee = employeeArray.find(items => 
            filteredArray[i].reporteeId === items.employeeID);//go find reportee
            mainFilteredArray.push(reportee); //add reportee to list after manager
    }

    return mainFilteredArray; //return list of Reportees
}

//this function sorts the managers and their repective reportees in the correctly formatted data format and then pushes to the server -- two helper methods: FilterList and GetReportees
async function SortList () {
   const employeeArray = await SelectAllEMployees(); //get all Employee data from db and add to array
   const RelationshipArray = await SelectAllRelationships();//get all Employee relationship data from db and add to array
   let MainFilteredArray = []; // this is the list for the completed sorted data acording to system requirements

   for(let i = 0; i < employeeArray.length; i++){ //go through employees and sort them acording to job role
    let employee = employeeArray[i];//set to first employee
    //is there existing data if yes check if employee is already saved to list, if not add to list
        if(MainFilteredArray.length > 0){ 
          const employeeExist = MainFilteredArray.find(item => 
                employee.employeeID === item.managerId
            || employee.employeeID === item.reporteeId)
            if(employeeExist){
                //do not add to list go to next employee
                continue;  // Skip this iteration
            }
            else{
                //find new manager and reportees and add to list
                const filteredList = FilterList(RelationshipArray, employeeArray, employee);
                MainFilteredArray = MainFilteredArray.concat(filteredList); // add all employees to list with appendend data to old data
            }
        }
        else{
            //find new manager and reportee and add to list
            const filteredList = FilterList(RelationshipArray, employeeArray, employee);
            MainFilteredArray = MainFilteredArray.concat(filteredList); // add all employees to list with appendend data to old data
        }
   }
   //post sorted data to the server: 
   console.log(await PostToServer('api/employee-sorter/test', MainFilteredArray));
}

//i will admit this code needs refactoring because the CallEmployeeandSave and CallRelationshipdataAndSave. could have been one function instead of two if you want to follow the don't repeat yourself rule! in a bigger app this is a bigger issue bacause it is always best to fix a problem in one place not several. especially if it is the same code
//these functions also do not follow the don't repeat yourself rule: SaveAllEmployees and SaveAllEmployeesRelationships. never do this in a bigger app! --mike!

//this function call data from api and saves it to local db
async function CallEmployeeandSave(getEmployeeQuery) { //params is the api -end-point querry string you want to call
    let total; //amount of server data for end-point
    const employee = await GetApiData(getEmployeeQuery) //api-call to get data
    .then(response => {

        const employeeArray = response.data.map(item => ({ //build data object and store as array
            name: item.name,      //name of employee   
            employeeID: item.id, //employeeID to find out if the employee is manager or reportee  
        }));

        console.log('employee data:', employeeArray); //log data pull progress
        insertBulkEmployees(employeeArray); //save 500 records to local db
        total = response['totalCount']; //get total count from json with bracket notation
    })
    return total; //return total amount of record in api-end-point
}

//this function calls the api many times and saves data to db until the api-end-point data is stored into local db. this function stores all data from this end-point
async function SaveAllEmployees() { 
    const getEmployeeQuery =  
    `api/employee-sorter/get-employees?limit=500&skip=${skipAmount}`; //api end-point querry string

    let total = await CallEmployeeandSave(getEmployeeQuery); //call api and get first 500
    let skipAmount = 500; // amount to skip, this is to specify how many api records to skip, if lets say you don't want to get the first 500 skip them or maybe the first 1500, but we want to get the next 500 since we already saved the first 500

    for(let skip = skipAmount; skip < total; skip += 500){ //loop through whole end-point to pull and save data
        const getEmployeeQuery = 
        `api/employee-sorter/get-employees?limit=500&skip=${skipAmount}`;//api end-point querry string assign new skip amount
        await CallEmployeeandSave(getEmployeeQuery); // call api to get data until all data is pulled from server
    }

    console.log('Employee SQl Data Size'+
        SelectAllEMployees().length); //log local db size for testing purposes
}

//this function call data from api and saves it to local db
async function CallRelationshipdataAndSave(getReporteeQuery) { //params is the api -end-point querry string you want to call
    let total;//amount of server data for end-point
    const ReporteeRelationship = await GetApiData(getReporteeQuery) //api-call to get data
    .then(ReporteeData => { 

        const relationshipsArray = ReporteeData.data.map(item => ({//build data object and store as array
            RecordID: item.id,          //this is just the api -end-points sql record id
            managerID: item.managerId,  //the manager for this record
            reporteeID: item.reporteeId //the reportee for the manager
        }));

        console.log('Reportee data:', relationshipsArray); //log progress data save to db
        insertBulkRelationships(relationshipsArray); //insert 500 records
        total = ReporteeData['totalCount']; //get total count from json with bracket notation
    })
    return total;//return total amount of record in api-end-point
}

//this function calls the api many times and saves data to db until the api-end-point data is stored into local db. this function stores all data from this end-point
async function SaveAllEmployeesRelationships(skipAmount, total){
    const getReporteeQuery = 
        `api/employee-sorter/get-reporting-relationship?limit=500&skip=${skipAmount}`;
        //api end-point querry string

    total = await CallRelationshipdataAndSave(getReporteeQuery);//call api and get first 500
    skipAmount = 500;// amount to skip, this is to specify how many api records to skip, if lets say you don't want to get the first 500 skip them or maybe the first 1500, but we want to get the next 500 since we already saved the first 500

    for(let skip = skipAmount; skip < total; skip += 500){ //loop through whole end-point to pull and save data
        const getReporteeQuery = 
        `api/employee-sorter/get-reporting-relationship?limit=500&skip=${skip}`;
        await CallRelationshipdataAndSave(getReporteeQuery); // call api to get data until all data is pulled from server
    }

    console.log('EmployeeRalationship SQl Data Size'+ 
        SelectAllRelationships().length); //log local db size for testing purposes
}

function RunApp(){ //main entry point function for application 
    try{
        InitDBandCreateTables(); //create new db or connect and then create tables if tables do not exist

        const serverStatus = CheckServerAvailabilty() //check if the server is available?
        .then(Status => {
            if(Status['message'] === 'Service is running'){ //if server is online get data, sort list and push to server
                console.log('Server is online')
           
            SaveAllEmployees(0,0); //call api-get employees and save to database

            SaveAllEmployeesRelationships(0,0); //call api-get employees Relationships and save to database

            SortList(); //sort the employees in correct format and push to server
        
            }else{
                console.log('Server is not running or unavailable')//server is donw
            }
        });  
    }
    catch(error){
        console.error('App-Run Error', error); //catch any runtime errors
    }
}

RunApp(); //run the automated app!