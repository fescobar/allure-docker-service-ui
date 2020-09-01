import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

class AllureDockerInfoDialog extends Component {
  handleCloseDialog = () => {
    this.props.handleCloseDialog();
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">INFO</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography
              component="span"
              variant="body1"
              color="textSecondary"
              align="left"
            >
              {"Frank Escobar --> "}
              <Link
                color="inherit"
                href="http://ar.linkedin.com/in/fescobarsystems"
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn
              </Link>
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography
              component="span"
              variant="body1"
              color="textSecondary"
              align="left"
            >
              {"Support --> "}
              <Link
                color="inherit"
                href="https://gitter.im/allure-docker-service/community"
                rel="noopener noreferrer"
                target="_blank"
              >
                Gitter
              </Link>
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography
              component="span"
              variant="body1"
              color="textSecondary"
              align="left"
            >
              {"UI --> "}
              <Link
                color="inherit"
                href="https://github.com/fescobar/allure-docker-service-ui"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://github.com/fescobar/allure-docker-service-ui
              </Link>
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography
              component="span"
              variant="body1"
              color="textSecondary"
              align="left"
            >
              {"API --> "}
              <Link
                color="inherit"
                href="https://github.com/fescobar/allure-docker-service"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://github.com/fescobar/allure-docker-service
              </Link>
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography
              component="span"
              variant="body1"
              color="textSecondary"
              align="left"
            >
              {"Examples --> "}
              <Link
                color="inherit"
                href="https://github.com/fescobar/allure-docker-service-examples"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://github.com/fescobar/allure-docker-service-examples
              </Link>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default AllureDockerInfoDialog;
