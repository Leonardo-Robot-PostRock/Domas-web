import { NextResponse } from 'next/server';
import axios from 'axios';


export default async function handler (req, res) {


    const session = req.cookies.auth_service;

    if (!session)
        return res.redirect(`${process.env.APP_URL}/login`);

    const { customer_code } = req.query;

    const requestBody = {
        customer_code: parseInt(customer_code),
    };
    const urlRequest = `${process.env.OKAM_URL}/check_customer_status_by_customer_code`;


    let return_value;
    let okam_response;
    let status;

    try {
        const response = await axios.get(urlRequest, {
            data: requestBody
        });

        // get http status code
        status = response.status;

        okam_response = response.data;

        return_value = res.status(response.status).json(response.data)

    } catch (error) {
        // get http status code
        status = error.response?.status || 500;

        // get data from response
        okam_response = error.response?.data || null;

        return_value = res.status(status).json({ error: true, message: error.toString(), okam_response });
    }

    //get ticket_id from query
    const ticket_id = req.query.ticket_id;
    
    if (!ticket_id){
        console.error('ticket_id is null');
        return return_value;
    }

    if(status >= 400 && status != 422){
        console.error(`Error from okam. Status code: ${status}`);
        return return_value;
    }

    //if ticket_id is not null, then update ticket history
    axios.post(`${process.env.AUTH_BASE_URL}/v1/ticket/history/okam`, {
        ticket_id,
        description: okam_response,
    }, {
        headers: {
            'Cookie': `auth_service=${session}`
        }
    })
        .catch(err => console.error(err));

    return return_value;
}