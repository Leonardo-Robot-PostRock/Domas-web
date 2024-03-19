import axios from 'axios';

export default async function handler(req, res) {
  const session = req.cookies.auth_service;

  if (!session) return res.redirect(`${process.env.APP_URL}/login`);

  let data = req.body;

  let response = await axios
    .patch(`${process.env.AUTH_BASE_URL}/v1/ticket/update/status`, data, {
      headers: {
        Cookie: `auth_service=${session}`
      }
    })
    .then((response) => {
      //console.log(response.data);
      return response;
    })
    .catch((error) => {
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

      return { status: 400, message: 'Hubo un error al realizar la petición.' };
    });

  res.status(response.status).json(response.data ? response.data : response.message);
}
