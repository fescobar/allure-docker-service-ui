import React, { Component } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import localAxios from "axios";

class AllureDockerInfoDialog extends Component {
  state = {
    version: null,
  };

  getConfig = () => {
    const axios = localAxios.create();
    axios
      .get(`${process.env.PUBLIC_URL}/config.json`)
      .then((response) => {
        this.setState({ version: response.data.version });
      })
      .catch((error) => {
        this.setState({ version: 'NOT_FOUND' });
      });
  };

  handleCloseDialog = () => {
    this.props.handleCloseDialog();
  };

  componentDidUpdate() {
    if (!this.state.version) {
      this.getConfig();
    }
  }

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
              variant="h6"
              color="textSecondary"
              align="left"
            >
              Allure UI Version
            </Typography>
            <Typography
              variant="subtitle2"
              color="secondary"
              align="center"
            >
              {this.state.version}
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography
              component="span"
              variant="h6"
              color="textSecondary"
              align="left"
            >
              Support
            </Typography>
            <Typography
              variant="subtitle2"
              color="secondary"
              align="center"
            >
              <Link
                color="inherit"
                href="https://gitter.im/allure-docker-service/community"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://gitter.im/allure-docker-service/community
              </Link>
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography
              component="span"
              variant="h6"
              color="textSecondary"
              align="left"
            >
              UI
            </Typography>
            <Typography
              variant="subtitle2"
              color="secondary"
              align="center"
            >
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
              variant="h6"
              color="textSecondary"
              align="left"
            >
              API
            </Typography>
            <Typography
              variant="subtitle2"
              color="secondary"
              align="center"
            >
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
              variant="h6"
              color="textSecondary"
              align="left"
            >
              Examples
            </Typography>
            <Typography
              variant="subtitle2"
              color="secondary"
              align="center"
            >
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
        <DialogTitle id="form-dialog-title">AUTHOR</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography
              component="span"
              variant="body1"
              color="textSecondary"
              align="left"
            >
              {"Frank Escobar"}
            </Typography>
            <Typography
              variant="subtitle2"
              color="secondary"
              align="center"
            >
              <Link
                color="inherit"
                href="https://www.linkedin.com/in/fescobarsystems/"
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn
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
