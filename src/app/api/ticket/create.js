import axios from 'axios';

export default async function handler(req, res) {
  const session = req.cookies.auth_service;

  if (!session) return res.redirect(`${process.env.APP_URL}/login`);

  let response = await axios
    .post(`${process.env.AUTH_BASE_URL}/v1/ticket/dumas/create`, req.body, {
      headers: {
        Cookie: `auth_service=${session}`
      }
    })
    .then((response) => {
      //(response.data);
      return response;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        //(error.request);
        console.error(`NO SE PUDO CONECTAR CON EL SERVIDOR: ${error.request._currentUrl ?? 'URL no disponible'}`);
      } else {
        // Something happened in setting up the request that triggered an Error
        'Error', error.message;
      }

      return {
        status: error.response?.status || 400,
        error: true,
        message: error.response?.data?.message || 'Hubo un error al realizar la petición.'
      };
    });

  res.status(response.status).json(response.data ? response.data : response);
}
