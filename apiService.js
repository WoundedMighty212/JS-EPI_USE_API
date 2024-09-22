import axios from 'axios';

const API_BASE_URL = 'https://interviewer-service.gl7ouskkmcjf2.us-east-1.cs.amazonlightsail.com/';

const assignedToken = 'bvjlt9nndhjtrsdfat2gzmn7';

export async function CheckServerAvailabilty() {
    try{
        const response = await fetch(`${API_BASE_URL}health`); 
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error
        ('Error Reaching Server: Server not found', error);
    }
}

export async function GetApiData(querryString){
    try{
        const response = await axios.get(`${API_BASE_URL}${querryString}`, 
            { 
                headers: 
                { 
                    'candidate-token': `${assignedToken}`,
                } 
            }
        );
        return response.data; 
    }
    catch(error){
        console.error
        ('APi-call Error:', error);
    }
}


export async function PostToServer(querryString, employeeDataArray) {
    try{
        const response = await axios.post(`${API_BASE_URL}${querryString}`, 
            employeeDataArray, 
            {
                headers: 
                { 
                    'candidate-token': `${assignedToken}`,
                    'Content-Type': 'application/json' 
                } 
            }
        ) 
        return response.data;
    }
    catch(error) {
        console.error
        ('APi-Push Error:', error);
    }
}