import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  paper: {
    padding: theme.spacing(2, 3, 0, 3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
});
class AllureDockerErrorPage extends Component {
  render() {
    const { classes } = this.props;
    let connectivityIssue = "";
    const errorMessage = this.props.error.message;
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
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h1" gutterBottom align="center">
                {this.props.error.status}
              </Typography>
              <Typography variant="h3" gutterBottom>
                {this.props.error.message}
              </Typography>
              {connectivityIssue}
              <Typography
                variant="body1"
                gutterBottom
                paragraph
                align="justify"
              >
                {this.props.error.stackTrace}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
export default withStyles(styles, { withTheme: true })(AllureDockerErrorPage);
