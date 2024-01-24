import axios from "axios";

export async function checkTicketStatus (ticket) {
    return await axios.get(`/api/okam/status/${ticket.customer.code}?ticket_id=${ticket.id}`)
    .then(res => {
        console.log("Ver estado de tickets",res);
        return {
            status: 'online',
            tech: res.data.tech,
            verifiedAt: new Date()
        };
    })
    .catch(err => {
        //console.log(err);
        const status = err.response?.status;
        let okam_response = err.response?.data?.okam_response || null;

        let statusMessage, statusValue;


        if (status == 404) {
            statusMessage = 'unknown';
            statusValue = 'no se encontró en Disponibilidad';
        } else if (status >= 400 && status < 500) {
            statusMessage = 'offline';
            statusValue = 'no cuenta con conexión';
        } else {
            statusMessage = 'unknown';
            statusValue = 'hubo un error al verificar el estado de conexión del cliente';
        }

        return {
            status: statusMessage,
            tech: okam_response? okam_response.tech : null,
            verifiedAt: new Date()
        };
    });

}

export async function checkClosedTicketStatus (ticket) {
    
    return await axios.get(`/api/okam/status/v2?ticket_id=${ticket.id}&customer_code=${ticket.customer.code}`)
    .then(async res => {
        let data = res.data;

        if(data?.okam_diagnostic) {
            let translation;

            if (data.okam_diagnostic.status !== 'success') {
                translation = await axios.post(`/api/okam/translateMsg`, { 
                    msg_code: data.okam_diagnostic.msg_code,
                    msg_en: data.okam_diagnostic.diagnostic 
                })
                    .then(res => res.data)
                    .catch(err => {
                        return { error: true, message: 'Error al traducir el mensaje de OKAM.' };
                    });
                
                if (!translation.error) {
                    data.okam_diagnostic.diagnostic = translation.msg;
                }
            }
            else {
                data.okam_diagnostic.diagnostic = 'La conexión del cliente es correcta. Verificado por OKAM.';
            }           
            
            return data.okam_diagnostic;
        }

        return { error: true, message: 'La respuesta de OKAM no incluye un diagnóstico. Debe verificar el ticket con Soporte.' };
    })
    .catch(err => {
        console.log(err);        
        return  { error: true, message: 'Hubo un error inesperado al realizar el diagnóstico con OKAM. Debe verificar el ticket con Soporte.' };
    });

}