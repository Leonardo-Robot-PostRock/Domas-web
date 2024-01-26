import { ChakraProvider } from '@chakra-ui/react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@/styles/mapbox.css';
import '@/styles/form.css';
import theme from '@/styles/global';
import LoadingRender from '@/components/LoadingRender';
import { getCookie } from 'cookies-next';
import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from '@/components/layout';

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

  console.log({ theme });

  setInterval(checkCookieExpiration);

  return (
    <ChakraProvider theme={theme}>
      <main>
        <Layout>
          <LoadingRender>
            <Component />
          </LoadingRender>
        </Layout>
      </main>
    </ChakraProvider>
  );
}

export default MyApp;
