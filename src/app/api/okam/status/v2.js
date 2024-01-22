import axios from 'axios';


export default async function handler (req, res) {
 
    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    const { ticket_id, customer_code } = req.query;
   
    let response = await axios.get(`${process.env.OKAM_URL_V2}/api/v2/customer-status/${customer_code}`, {
        headers: {
            Authorization: `Bearer ${process.env.OKAM_V2_API_KEY}`,
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
                let message = `NO SE PUDO CONECTAR CON EL SERVIDOR: ${error.request._currentUrl?? 'URL no disponible'}`;
                console.log(message);
                return { status: 500, message: 'Servidor no disponible.' };
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }

            return { status: 400, message: 'Hubo un error al realizar la petición.' };
        });

    if (response.status >= 400) {
        return res.status(response.status).json(response.data ? response.data : response.message);
    }

    // Guardar log en mongo db
    if(response.data?.okam_diagnostic && ticket_id){
        let okam_diagnostic = response.data.okam_diagnostic;
        let connection_data = response.data.connection_data? response.data.connection_data : null;

        axios.post(`${process.env.AUTH_BASE_URL}/v1/ticket/history/okam`, {
            ticket_id,
            description: {
                ...okam_diagnostic,
                connection_data
            },
        }, {
            headers: {
                'Cookie': `auth_service=${session}`
            }
        })            
            .catch(err => console.error(err));
    }

    res.status(response.status).json(response.data ? response.data : response.message);
}
