import { NextResponse } from 'next/server';
import axios from "axios";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    const ticket_id = req.query.ticket_id;
    const data = req.body;

    const teamsUrl = `${process.env.AUTH_BASE_URL}/v1/ticket/${ticket_id}/change/recoordinate`;

    try {
        const request = await axios.patch(teamsUrl, data, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        });


        return res.status(200).json({error: false, data:request.data})


    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: true, message: error.toString() });
    }



}