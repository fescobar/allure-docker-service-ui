import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import allure from "../../assets/images/allure.png";
import docker from "../../assets/images/docker.png";

function AllureDockerHomePage() {
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
              height: 850,
            }}
          >
            <div style={{ height: "100%" }} align="center">
              <img src={allure} alt="allure" />
              <img src={docker} alt="docker" />
              <Typography variant="h3" color="textSecondary" align="center">
                ALLURE DOCKER SERVICE UI
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AllureDockerHomePage;
