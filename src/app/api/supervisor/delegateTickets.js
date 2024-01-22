import axios from 'axios';


export default async function handler (req, res) {
    
    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    const data = req.body;

    if (data.workerId && data.tickets) {

        let dataResponse = await axios.put(`${process.env.AUTH_BASE_URL}/v1/ticket/delegate`, data, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })
            .then(response => {
                //console.log(response.data);
                return response;
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code that falls out of the range of 2xx           
                    console.log(error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }

                return { status: 400, message: error.response?.data?.message || 'Hubo un error al realizar la petición.' };
            });

        res.status(dataResponse.status).json(dataResponse.data ? dataResponse.data : dataResponse);
    }
    else {
        res.status(400).json({ message: 'workerId y tickets son necesarios para ejecutar esta acción.' });
    }
    // Not Signed in
}
