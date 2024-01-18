import { NextResponse } from 'next/server';
import axios from "axios";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    const ticket_id = +req.body.ticket_id || +req.body.id;

    const url = `${process.env.AUTH_BASE_URL}/v1/ticket/${ticket_id}/update/technician`;

    try {

        const response = await axios.patch(url, req.body,
            {
                headers: {
                    'Cookie': `auth_service=${session}`
                },
            }
        )


        return res.status(200).json(response.data)

    } catch (error) {
        return res.status(400).json({ error: true, message: error.toString() });
    }


}
