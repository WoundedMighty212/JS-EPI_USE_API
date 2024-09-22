import axios from 'axios'; //api 3rd party function for api-calls

//api address URL
const API_BASE_URL = 'https://interviewer-service.gl7ouskkmcjf2.us-east-1.cs.amazonlightsail.com/';

//API-Security token --hard coded --not best way but for example is fine!
const assignedToken = 'bvjlt9nndhjtrsdfat2gzmn7';

//this function tries to see if the api is available
export async function CheckServerAvailabilty() {
    try{
        const response = await fetch(`${API_BASE_URL}health`);//run end point to see if server is alive 
        const data = await response.json(); //get json response from server
        return data; //return json data
    }
    catch(error){ //catch errors from api call -- otherwize app breaks
        console.error
        ('Error Reaching Server: Server not found', error);
    }
}

//param is for any type of API end point app needs to call a get function for, to retrieve data
export async function GetApiData(querryString){
    try{
        const response = await axios.get(`${API_BASE_URL}${querryString}`, //this runs a get to fetch data from end point with the qeury string as the end-point URL request.
            { 
                headers: //here we just add the let's say the pass code to access the end point, passcode is passed as candidate-token's assignedToken result.
                { 
                    'candidate-token': `${assignedToken}`, //passcode or jwt token is passed here! as assignedToken
                } 
            }
        );
        return response.data; //get json response from server
    }
    catch(error){ //catch any errors breaking app
        console.error
        ('APi-call Error:', error);
    }
}

//this function runs a post api-call to submit data to server, in this case the data should be sorted array according to system specification
export async function PostToServer(querryString, employeeDataArray) { //params querry which is post end-point URL and employeeDataArray is the sorted list for the employees in order manager -> reportees 
    try{
        const response = await axios.post(`${API_BASE_URL}${querryString}`, //submits data to api
            employeeDataArray, 
            {
                headers: //pass the content type to server, as well as passcode
                { 
                    'candidate-token': `${assignedToken}`,
                    'Content-Type': 'application/json' 
                } 
            }
        ) 
        return response.data; //get server-api-call response
    }
    catch(error) { //catch any errors breaking app
        console.error
        ('APi-Push Error:', error);
    }
}