import axios from "axios";
import sharp from "sharp";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    const { id } = req.query

    let url = '';
    let teamsResponse;
    
    try {

        if (req.method === 'PATCH') {
            url = `${process.env.AUTH_BASE_URL}/v1/team/${id}/update`;

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
        

            teamsResponse = await axios.patch(url, req.body, {
                headers: {
                    'Cookie': `auth_service=${session}`
                }
            });
        } 
        else if (req.method === 'DELETE') {
            url = `${process.env.AUTH_BASE_URL}/v1/team/${id}`;

            teamsResponse = await axios.delete(url,{
                headers: {
                    'Cookie': `auth_service=${session}`
                }
            });
        } 
        else if (req.method === 'GET') {
            url = `${process.env.AUTH_BASE_URL}/v1/team/${id}`;

            teamsResponse = await axios.get(url,{
                headers: {
                    'Cookie': `auth_service=${session}`
                }
            });
        }

        return res.status(200).json(teamsResponse.data)


    } catch (error) {
        const message = error.toString().toUpperCase().includes('AXIOSERROR') || error.toString().toUpperCase().includes('TYPEERROR') ? 'Ocurrió un error al ejecutar esta operación.' : error.toString();

        return res.status(error.response.status || 500).json({ error: true, message: message });
    }



}