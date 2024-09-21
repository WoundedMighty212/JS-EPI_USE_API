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
       // throw error;
    }
}