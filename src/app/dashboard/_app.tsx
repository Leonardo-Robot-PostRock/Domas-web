import { ChakraProvider } from "@chakra-ui/react";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/styles/mapbox.css";
import "@/styles/form.css";
import theme from "@/styles/global";
import Layout from "@/components/layout";
import LoadingRender from "@/components/LoadingRender";
import { getCookie } from "cookies-next";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  pageProps: {
    session: any;
    pageProps: string[];
  };
  Component: SignInPageProps;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: Props) {
  console.log("ver props", { ...pageProps });

  function checkCookieExpiration() {
    const cookieExpiration = getCookie("auth_service");
    if (!cookieExpiration) {
      //TODO agregar modal avisando que debe volver a iniciar sesión
      // router.push('/login');
    }
  }

  setInterval(checkCookieExpiration);

  return (
    <ChakraProvider theme={theme}>
      <main fontFamily={"poppins"}>
        <Layout>
          <LoadingRender>
            <Component {...pageProps} />
          </LoadingRender>
        </Layout>
      </main>
    </ChakraProvider>
  );
}

export default MyApp;
