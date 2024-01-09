import React, { Component } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { withStyles } from "@mui/material/styles";

import allure from "../../assets/images/allure.png";
import docker from "../../assets/images/docker.png";

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
    height: 850,
  },
});
class AllureDockerHomePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
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
}
export default withStyles(styles, { withTheme: true })(AllureDockerHomePage);
