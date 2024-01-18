import { NextResponse } from 'next/server';
import axios from 'axios';


export default async function handler (req, res) {
 
    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    const { customer_code } = req.query;
   
    let response = await axios.get(`${process.env.SOLDEF_URL}/api/v1/dumas/customer/${customer_code}/connection`, {
        headers: {
            Authorization: `Bearer ${process.env.SOLDEF_API_KEY}`
        }
    })
        .then(response => {
            //console.log(response.data);
            return response;
        })
        .catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx           
                console.log(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                //console.log(error.request);
                console.error(`NO SE PUDO CONECTAR CON EL SERVIDOR: ${error.request._currentUrl?? 'URL no disponible'}`);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }

            return { status: 400, message: 'Hubo un error al realizar la petición.' };
        });

    res.status(response.status).json(response.data ? response.data : response.message);


}
