import { NextResponse } from 'next/server';
import axios from "axios";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    // obtener el metodo de la peticion
    const method = req.method;

    if(!['POST','PUT'].includes(method.toUpperCase())){
        return res.status(400).json({ error: true, message: 'Metodo no permitido' });
    }
    const url = `${process.env.AUTH_BASE_URL}/v1/dumas/ticket/update/instalacion`;

    try {

        const axiosResponse = await axios({
            method: method,
            url: url,
            data: req.body,
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })


        return res.status(200).json({error: false, data:axiosResponse.data})


    } catch (error) {
        return res.status(400).json({ error: true, message: error.toString(), data: error.response.data });
    }



}