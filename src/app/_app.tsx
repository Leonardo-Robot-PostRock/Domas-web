'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Box } from '@chakra-ui/react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@/styles/mapbox.css';
import '@/styles/form.css';
import { getCookie } from 'cookies-next';
import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from './(dashboard)/layout';
import SessionExpiredModal from '@/components/ui/modals/ModalSesionExpired';

interface Props {
  Component: React.ComponentType;
}

function MyApp({ Component }: Props) {
  const router = useRouter();
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(checkCookieExpiration, 60000);

    return () => clearInterval(intervalId);
  }, []);

  function checkCookieExpiration() {
    const cookieExpiration = getCookie('auth_service');
    if (!cookieExpiration) {
      setShowSessionExpiredModal(true);
    }
  }

  function closeModal() {
    setShowSessionExpiredModal(false);
    router.push('/');
  }

  return (
    <Box fontFamily={'poppins'}>
      <Layout>
        <Component />
      </Layout>

      <SessionExpiredModal isOpen={showSessionExpiredModal} onClose={closeModal} />
    </Box>
  );
}

export default MyApp;
