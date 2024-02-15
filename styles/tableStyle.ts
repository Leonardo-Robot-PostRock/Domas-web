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
      color: white;
      background-color: #82AAE3;
      text-align: center;
      font-size: 10px;
      white-space: normal;
    }  
  `,
  Cell: `
    font-size: 11px;
    width: 100%;
    white-space: normal;
    
    div {
      text-align: center;
      white-space: normal;
    }
  `,

  Row: `
    &:nth-of-type(odd) {
      background-color: #D2DAFF;
      color: #25316D;
    }

    &:nth-of-type(even) {
      background-color: #EEF1FF;
      color: #25316D;
    }
  `,
};

export const tableStyle = useTheme([mantineTheme, customTheme]);
