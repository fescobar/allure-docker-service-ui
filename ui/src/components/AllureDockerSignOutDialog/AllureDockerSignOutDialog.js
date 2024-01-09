import React, { Component } from "react";
import Button from "@mui/material/Button";
import { Cookies } from "react-cookie";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "../../api/axios-allure-docker";
import { redirect, redirectRoot } from "../../utility/navigate";
import {withRouter} from "react-router-dom";
const cookies = new Cookies();

class AllureDockerSignOutDialog extends Component {
  signOut = () => {

    axios
      .delete("/logout")
      .then((response) => {
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("roles");

        const csrf = cookies.get("csrf_refresh_token");
        const config = {
          headers: {
            "X-CSRF-TOKEN": csrf
          }
        }

        axios
          .delete("/logout-refresh-token", config)
          .then((response) => {
            redirectRoot();
          })
          .catch((error) => {
            this.removeTokens()
            redirect(error);
            this.handleAPIErrorAlert(error);    
          });
      })
      .catch((error) => {
        redirect(error);
        this.handleAPIErrorAlert(error);
      });
    this.handleCloseDialog();
  };

  removeTokens = () => {
    cookies.remove('csrf_access_token', { path:'/'});
    cookies.remove('csrf_refresh_token', { path:'/'});
  }

  handleCloseDialog = () => {
    this.props.closeSignOutDialog();
  };

  handleAPIErrorAlert = (error) => {
    this.props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.handleCloseDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Sign Out</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to sign out?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.signOut} color="secondary">
              Sign Out
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}
export default withRouter(AllureDockerSignOutDialog);
