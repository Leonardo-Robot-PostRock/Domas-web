'use client';
import { Box } from '@chakra-ui/react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@/styles/mapbox.css';
import '@/styles/form.css';
import LoadingRender from '@/components/LoadingRender';
import { getCookie } from 'cookies-next';
import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from '@/app/(dashboard)/layout';

interface Props {
  Component: React.ComponentType;
}

function MyApp({ Component }: Props) {
  function checkCookieExpiration() {
    const cookieExpiration = getCookie('auth_service');
    if (!cookieExpiration) {
      //TODO agregar modal avisando que debe volver a iniciar sesión
      // router.push('/login');
    }
  }

  setInterval(checkCookieExpiration);

  return (
    <Box fontFamily={'poppins'}>
      <Layout>
        <LoadingRender>
          <Component />
        </LoadingRender>
      </Layout>
    </Box>
  );
}

export default MyApp;
