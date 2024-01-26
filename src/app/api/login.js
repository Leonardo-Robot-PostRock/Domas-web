import axios from 'axios';

export default async function handler(req, res) {
  const { username, password } = req.body;

  try {
    const axiosReq = await axios.post(`${process.env.AUTH_BASE_URL}/auth/login`, {
      username,
      password,
    });

    let session_cookie = axiosReq.headers['set-cookie'][0];

    session_cookie = session_cookie.split(';');

    let obj = session_cookie.reduce((acc, cur) => {
      let [key, value] = cur.split('=');
      key = key.replaceAll(' ', '');
      acc[key] = value;
      return acc;
    }, {});

    return res.status(200).json({ user: axiosReq.data, sessionCookie: obj });
  } catch (error) {
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

    return res.status(400).json({ message: 'Credenciales incorrectas' });
  }
}
