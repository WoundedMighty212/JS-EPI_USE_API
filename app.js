import {CheckServerAvailabilty} from './apiService.js'

function RunApp(){
    try{
        const serverStatus =  CheckServerAvailabilty()
        .then(serverStatus => 
            console.log('Server Status:', serverStatus));
    }
    catch(error){
        console.error('Error fetching server status:', error);
    }
}

RunApp();