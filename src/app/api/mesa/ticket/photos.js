import axios from 'axios';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
};

export default async function handler(req, res) {
  const session = req.cookies.auth_service;

  if (!session) return res.redirect(`${process.env.APP_URL}/login`);

  let { ticket_id } = req.query;

  if (req.method === 'GET') {
    let response = await axios
      .get(`${process.env.AUTH_BASE_URL}/v1/ticket/mesa/${ticket_id}/photos`, {
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

        return { status: 400, error: true, message: 'Hubo un error al realizar la petición.' };
      });

    res.status(response.status).json(response.data ? response.data : response);
  } else if (req.method === 'POST') {
    let data = req.body.data;

    if (!data.photos || data.photos.length === 0) {
      return res.status(400).json({ error: true, message: 'Faltan fotos' });
    }

    let compressedPhotos = [];

    for (const photo of data.photos) {
      var img = Buffer.from(photo, 'base64');

      const dataBuffer = await sharp(img).toFormat('jpeg').toBuffer();
      compressedPhotos.push(dataBuffer.toString('base64'));
    }

    data.photos = compressedPhotos;

    let response = await axios
      .post(`${process.env.AUTH_BASE_URL}/v1/ticket/mesa/${ticket_id}/photos`, data, {
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

        return { status: 400, error: true, message: 'Hubo un error al realizar la petición.' };
      });

    res.status(response.status).json(response.data ? response.data : response);
  } else if (req.method === 'DELETE') {
    if (!req.query.photo_id) {
      return res.status(400).json({ error: true, message: 'Faltan datos' });
    }

    let response = await axios
      .delete(`${process.env.AUTH_BASE_URL}/v1/ticket/mesa/${ticket_id}/photos/${req.query.photo_id}`, {
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

        return { status: 400, error: true, message: 'Hubo un error al realizar la petición.' };
      });

    res.status(response.status).json(response.data ? response.data : response);
  }
}
