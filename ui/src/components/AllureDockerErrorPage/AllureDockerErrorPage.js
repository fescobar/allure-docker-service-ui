import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function AllureDockerErrorPage(props) {
  const { error } = props;
  let connectivityIssue = "";
  const errorMessage = error.message;
  if (errorMessage) {
    if (errorMessage.includes("Network Error")) {
      connectivityIssue = (
        <React.Fragment>
          <Typography variant="h5" gutterBottom>
            Check if you have access to{" "}
            <Link
              color="secondary"
              href={window._env_.ALLURE_DOCKER_API_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              {window._env_.ALLURE_DOCKER_API_URL}
            </Link>
          </Typography>
          <Typography variant="h5" gutterBottom>
            Or pull the latest "frankescobar/allure-docker-service" API image (remove your current latest version)
          </Typography>
        </React.Fragment>
      );
    }
  }

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
              {error.status}
            </Typography>
            <Typography variant="h3" gutterBottom>
              {error.message}
            </Typography>
            {connectivityIssue}
            <Typography
              variant="body1"
              gutterBottom
              paragraph
              align="justify"
            >
              {error.stackTrace}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AllureDockerErrorPage;
