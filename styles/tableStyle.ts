import { useTheme } from '@table-library/react-table-library/theme';
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/chakra-ui';

const mantineTheme = getTheme({
  ...DEFAULT_OPTIONS,
  striped: false,
});

const customTheme = {
  Table: `
    grid-template-columns: 44px repeat(11, minmax(0, 1fr));
    margin: 20px 20px 0 20px;
    place-items: center;
    
    @media(min-width: 902px) {
      place-items: center;
      grid-auto-rows: minmax(max-content, 60px)
    }
    
    @media(min-width: 1440px) {
      place-items: center;
      grid-auto-rows: minmax(max-content, 70px)
    }
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

    .th * {
      justify-content: center;
    }

    .th:first-of-type, th:first-of-type > div{
      width: 24px;
    }
  `,
  Cell: `
    font-size: 11px;
    width: 100%;
    text-align:center;
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

    .td:first-of-type > div {
      margin-left: 10px
    }

    .td:first-of-type, div {
      padding: 0;
    }
  `,
};

export const tableStyle = useTheme([mantineTheme, customTheme]);
