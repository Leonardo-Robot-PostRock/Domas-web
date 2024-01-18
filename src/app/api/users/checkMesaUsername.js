import { NextResponse } from 'next/server';
import axios from 'axios';

export default async function handler(req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

        
    let user = await axios.post(`${process.env.AUTH_BASE_URL}/v1/user/check-mesa-username`, req.body, {
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
            return { status: error.response.status, message: error.response.data.message? error.response.data.message : 'Hubo un error al realizar la petición.' }
            
        } else if (error.request) {
        // The request was made but no response was received
            console.log(error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        
        return { status: 400, message: 'Hubo un error al realizar la petición.' };
    });


    res.status(user.status).json(user.data? user.data : {message: user.message});
}