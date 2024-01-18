import { NextResponse } from 'next/server';
import axios from "axios";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    // get the date from the query string
    const date = req.query.date;

    const url = `${process.env.AUTH_BASE_URL}/v1/roadmap/tickets?date=${date}`;

    

    try {
        const request = await axios.get(url, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        });


        return res.status(200).json({ error: false, data: request.data.tickets })


    } catch (error) {
        return res.status(400).json({ error: true, message: error.toString() });
    }


}
