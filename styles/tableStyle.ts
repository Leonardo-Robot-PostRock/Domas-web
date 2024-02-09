import { useTheme } from '@table-library/react-table-library/theme';
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/chakra-ui';

const mantineTheme = getTheme({
  ...DEFAULT_OPTIONS,
  striped: false,
});
const customTheme = {
  Table: `
      --data-table-library_grid-template-columns:  44px repeat(5, minmax(0, 1fr));
      margin: 20px;
      place-items: center;
  `,
  HeaderCell: `
    width:100%;
    div {
      white-space: normal;
    }
  `,
  Header: `
    .th {
      color: #01497c;
      text-align: center;
      font-size: 11px;
      white-space: normal;
    }  
  `,
  Cell: `
    font-size: 12px;
    width: 100%;
    white-space: normal;
    
    div {
      text-align: center;
      white-space: normal;
    }
  `,

  Row: `
    &:nth-of-type(odd) {
      background-color: #014f86;
      color: white;
    }

    &:nth-of-type(even) {
      background-color: #2a6f97;
      color: white;
    }
  `,
};

export const tableStyle = useTheme([mantineTheme, customTheme]);
