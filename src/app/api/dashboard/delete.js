import axios from 'axios';

/**
 * Endpoint para obtener los dashboards del usuario autenticado
 */
export default async function handler(req, res) {
  const session = req.cookies.auth_service;

  if (!session) return res.redirect(`${process.env.APP_URL}/login`);

  // get id from body
  const id = +req.body.id;

  const url = `${process.env.AUTH_BASE_URL}/v1/dashboard/delete/${id}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Cookie: `auth_service=${session}`
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).json({ error: true, message: error.toString(), response: error.response.data });
  }
}
