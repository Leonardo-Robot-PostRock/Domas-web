import { NextResponse } from 'next/server';
import axios from "axios";
import sharp from "sharp";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    if(req.body.primary_file){
        const file = req.body.primary_file;
        var img = Buffer.from(file, 'base64');
        const data = await sharp(img).resize({ width: 200, height: 200 }).toFormat('jpeg').toBuffer();
        
        req.body.primary_file = data.toString('base64');
    }
    if(req.body.secondary_file){
        const file = req.body.secondary_file;
        var img = Buffer.from(file, 'base64');
        const data = await sharp(img).resize({ width: 200, height: 200 }).toFormat('jpeg').toBuffer();

        req.body.secondary_file = data.toString('base64');
    }

    const teamsUrl = `${process.env.AUTH_BASE_URL}/v1/team`;

    try {
        const teamsResponse = await axios.post(teamsUrl, req.body,
            {
                headers: {
                    'Cookie': `auth_service=${session}`
                }
            }
        );


        return res.status(200).json(teamsResponse.data)


    } catch (err) {
        const { message,error } = err.response.data;
        return res.status(400).json({ error: true,error,message });
    }



}