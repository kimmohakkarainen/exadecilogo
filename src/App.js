import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import ProTip from "./protip";
import GraphView from "./graph";
import Zoom from "./zoom";

const data1 = {
  nodes: [
    { index: 0, name: "eka", value: 60, hours: "1:00" },
    { index: 1, name: "toka", value: 120, hours: "2:00" },
    { index: 2, name: "kol", value: 180, hours: "3:00" },
    { index: 3, name: "nel", value: 80, hours: "1:20" },
    { index: 4, name: "vii", value: 100, hours: "1:40" }
  ],
  links: [
    { source: 0, target: 2, value: 60, hours: "+1:00" },
    { source: 1, target: 2, value: 120, hours: "+2:00" },
    { source: 2, target: 3, value: 80, hours: "+1:20" },
    { source: 2, target: 4, value: 100, hours: "+1:40" }
  ]
};

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

/*         
<Typography variant="h4" component="h1" gutterBottom>
          Create React App v4-beta example
        </Typography>

<GraphView data={data1} /> */

export default function App() {
  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Zoom />
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
