import axios from "axios";

export default async function handler (req, res) {

    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    // obtener el metodo de la peticion
    const method = req.method;

    if (!['GET'].includes(method.toUpperCase())) {
        return res.status(400).json({ error: true, message: 'Metodo no permitido' });
    }

    try {

        const axiosResponse = await axios({
            method: method,
            url: `${process.env.AUTH_BASE_URL}/v1/clusters`,
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })


        return res.status(200).json({ error: false, data: axiosResponse.data.data })



    } catch (error) {
        return res.status(400).json({ error: true, message: error.toString(), data: error.response.data });
    }



}