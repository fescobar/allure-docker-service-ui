import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function AllureDockerNotFound() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container spacing={8}>
        <Grid size={12}>
          <Paper
            sx={{
              pt: 2,
              px: 3,
              pb: 0,
              display: "flex",
              overflow: "auto",
              flexDirection: "column",
            }}
          >
            <Typography variant="h1" gutterBottom align="center">
              PAGE NOT FOUND
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AllureDockerNotFound;
