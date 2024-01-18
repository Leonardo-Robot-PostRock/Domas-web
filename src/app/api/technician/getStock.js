import { NextResponse } from 'next/server';
import axios from "axios";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    const mesa_username = req.query.mesa_username;
    const value = req.query.value;

    /* try {

        const { data, status } = await axios.get(`${process.env.SOLDEF_URL}/api/v1/st/inventario`, {
            headers: {
                'Authorization': `Bearer ${process.env.SOLDEF_API_KEY}`
            },
            params: {
                mesa_username: mesa_username,
                value: value
            }
        });


        return res.status(status).json(data);

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: error.toString() });
    } */

    let response = await axios.get(`${process.env.SOLDEF_URL}/api/v1/st/inventario`, {
        headers: {
            'Authorization': `Bearer ${process.env.SOLDEF_API_KEY}`
        },
        params: {
            mesa_username: mesa_username,
            value: value
        }
    })
    .then(response => {
        console.log(response.data);
        return response;
    })
    .catch(error => {
        if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx           
            console.log(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            console.error(`NO SE PUDO CONECTAR CON EL SERVIDOR: ${error.request._currentUrl?? 'URL no disponible'}`);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }

        return { status: 400, error: true, message: 'Hubo un error al realizar la petición.' };
    });
    
    
    res.status(response.status).json(response.data ? response.data : response);
}
