import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";
import {useState} from "react";
import Papa from "papaparse";
import qs from "qs";
import fileDownload from "js-file-download";

const Input = styled('input')({
  display: 'none',
});

export default function Index() {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState();

  const handleChange = ({ target: { files } }) => {
    setFile(files[0]);
  };

  const importCSV = () => {
    let updates = [];
    console.log(file, "file");
    Papa.parse(file, {
      delimiter: "",
      chunkSize: 3,
      header: false,
      complete: function(responses) {
        if(responses.data.length > 0) {
          const header = responses.data[0];
          const findNameIndexFromHeader = header.findIndex(h => h.toLowerCase() === "nama");
          const parsing = responses.data.filter((r, index) => index > 0).map((r, index) => {
              const createLink = `https://undangin-digital.com/isatami?${qs.stringify({guest: r[findNameIndexFromHeader]})}`;
              return {
                nama: r[findNameIndexFromHeader],
                link: createLink,
              }
          })
          setParsed(parsing);
        }

      }
    });
  };

  const parsedToCsv = () => {
    const papaUnparse = Papa.unparse(parsed);
    const blob = new Blob([papaUnparse], {type: "text/csv;charset=utf-8"});
    fileDownload(blob, 'Hasil.csv');
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <label htmlFor="contained-button-file">
          <Input
              accept=".csv"
              id="contained-button-file"
              type="file"
              onChange={handleChange} />

          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>

        <Button onClick={importCSV}>
          Parse
        </Button>

        <Button onClick={parsedToCsv}>
          Download
        </Button>
      </Box>
    </Container>
  );
}
