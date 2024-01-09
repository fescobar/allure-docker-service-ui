import React, { Component } from "react";
import { withStyles } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const styles = (theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
});

class AllureDockerSnackBar extends Component {
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.props.resetAPIAlert();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Snackbar
          open={this.props.show}
          autoHideDuration={this.props.duration}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={this.handleClose}
        >
          <Alert severity={this.props.severity} onClose={this.handleClose}>
            {this.props.message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(AllureDockerSnackBar);
