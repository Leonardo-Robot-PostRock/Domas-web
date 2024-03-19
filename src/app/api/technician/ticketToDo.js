import axios from 'axios';

export default async function handler(req, res) {
  const session = req.cookies.auth_service;

  if (!session) return res.redirect(`${process.env.APP_URL}/login`);

  const url = `${process.env.AUTH_BASE_URL}/v1/ticket/to_do?technician_id=${req.query.technician_id}`;

  try {
    const teamsResponse = await axios.get(url, {
      headers: {
        Cookie: `auth_service=${session}`
      }
    });

    return res.status(200).json(teamsResponse.data);
  } catch (error) {
    return res.status(400).json({ error: true, message: error.toString() });
  }
}
