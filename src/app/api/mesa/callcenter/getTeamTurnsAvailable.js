import { NextResponse } from 'next/server';
import axios from 'axios';


export default async function handler (req, res) {
 
    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    let team_id = req.query.team_id;
   
    let response = await axios.get(`${process.env.AUTH_BASE_URL}/v2/shifts/availables/${team_id}`, {
        headers: {
            'Cookie': `auth_service=${session}`
        }
    })
        .then(response => {
            //console.log(response.data);
            if(!response.data.data){
                return { status: 404, message: 'No hay turnos disponibles para este equipo.' };
            }

            return { status: 200, data: response.data.data };
        })
        .catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx           
                console.log(error.response.data);
                return { status: 400, message: error.response.data.message };

            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }

            return { status: 400, message: 'Hubo un error al realizar la petición.' };
        });

    res.status(response.status).json(response.data ? response.data : response);


}
