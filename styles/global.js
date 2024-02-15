import { extendTheme } from '@chakra-ui/react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        backgroundColor: props.colorMode === 'light' ? '#edf2f7' : '#282f44',
      },
      input: {
        fontSize: '14px !important',
      },
      label: {
        fontSize: '14px !important',
      },
      '.chakra-select ': {
        fontSize: '14px !important',
      },
      '.chakra-radio__label ': {
        fontSize: '14px !important',
      },
      '.chakra-form__helper-text': {
        fontSize: '13px !important',
      },
      '.react-datepicker__input-container': {
        height: '100%',
      },
      '.react-datepicker__input-container input': {
        display: 'block',
        width: '100%',
        padding: '7px',
        border: '1px solid #e2e8f0',
        borderTopRightRadius: '7px',
        borderBottomRightRadius: '7px',
        fontSize: '14px',
        height: '100%',
      },
    }),
  },
  fonts: {
    body: poppins.style.fontFamily,
    heading: poppins.style.fontFamily,
  },
  components: {
    Button: {
      variants: {
        primary_custom: {
          bg: '#0568FF',
          width: '100%',
          fontWeight: 'medium',
          fontSize: '14px',
          color: 'white',
          rounded: 'xl',
          _hover: {
            bg: '#085AFF',
          },
        },
      },
    },
  },
});

export default theme;
