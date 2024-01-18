import { NextResponse } from 'next/server';
import axios from 'axios';


export default async function handler(req, res) {
   
    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);
    
    
    if (req.method === 'GET'){
        let teams = await axios.get(`${process.env.AUTH_BASE_URL}/v1/calendar`, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx           
                console.log(error.response.data);
            } else if (error.request) {
            // The request was made but no response was received
                console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            
            return { status: 400, message: 'Hubo un error al realizar la petición.' };
        });
    
        res.status(teams.status).json(teams.data? teams.data : teams.message);
    }

    else if (req.method === 'POST'){
        
        let data = req.body;

        let addDayOff = await axios.post(`${process.env.AUTH_BASE_URL}/v1/calendar/add`, data, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx           
                console.log(error.response.data);
            } else if (error.request) {
            // The request was made but no response was received
                console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            
            return { status: 400, message: 'Hubo un error al realizar la petición.' };
        });
    
        res.status(addDayOff.status).json(addDayOff.data? addDayOff.data : addDayOff.message);
    }

    else if (req.method === 'PUT'){
        
        let data = req.body;

        let editDayOff = await axios.put(`${process.env.AUTH_BASE_URL}/v1/calendar/update/${data.id}`, data, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx           
                console.log(error.response.data);
            } else if (error.request) {
            // The request was made but no response was received
                console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            
            return { status: 400, message: 'Hubo un error al realizar la petición.' };
        });
    
        res.status(editDayOff.status).json(editDayOff.data? editDayOff.data : editDayOff.message);
    }

    else if (req.method === 'PATCH'){
        
        let data = req.body;

        let editTeam = await axios.patch(`${process.env.AUTH_BASE_URL}/v1/calendar/team/active`, data, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx           
                console.log(error.response.data);
            } else if (error.request) {
            // The request was made but no response was received
                console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            
            return { status: 400, message: 'Hubo un error al realizar la petición.' };
        });
    
        res.status(editTeam.status).json(editTeam.data? editTeam.data : editTeam.message);
    }

    else if (req.method === 'DELETE'){

        let date_id = req.query.date_id;   

        let deleteDayOff = await axios.delete(`${process.env.AUTH_BASE_URL}/v1/calendar/delete/${date_id}`, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx           
                console.log(error.response.data);
            } else if (error.request) {
            // The request was made but no response was received
                console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            
            return { status: 400, message: 'Hubo un error al realizar la petición.' };
        });
    
        res.status(deleteDayOff.status).json(deleteDayOff.data? deleteDayOff.data : deleteDayOff.message);
    }    
}
