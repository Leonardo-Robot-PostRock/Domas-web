import { NextResponse } from 'next/server';
import axios from "axios";
import { datetimeFromNow } from "@/utils/Datetime.js";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);


    const url = `${process.env.AUTH_BASE_URL}/v1/ticket/history/change/geo?limit=1000&search=geolocalización`;

    try {
        const request = await axios.get(url, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        });

        return res.status(200).json({ error: false, data: request.data.data })

    } catch (error) {
        return res.status(400).json({ error: true, message: error.toString() });
    }


}
