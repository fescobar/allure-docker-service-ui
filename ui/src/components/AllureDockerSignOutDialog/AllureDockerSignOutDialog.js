import React from "react";
import Button from "@mui/material/Button";
import { Cookies } from "react-cookie";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "../../api/axios-allure-docker";
import { redirect, redirectRoot } from "../../utility/navigate";

const cookies = new Cookies();

function AllureDockerSignOutDialog(props) {
  const removeTokens = () => {
    cookies.remove("csrf_access_token", { path: "/" });
    cookies.remove("csrf_refresh_token", { path: "/" });
  };

  const handleAPIErrorAlert = (error) => {
    props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  const signOut = () => {
    axios
      .delete("/logout")
      .then(() => {
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("roles");

        const csrf = cookies.get("csrf_refresh_token");
        const config = {
          headers: {
            "X-CSRF-TOKEN": csrf,
          },
        };

        axios
          .delete("/logout-refresh-token", config)
          .then(() => {
            redirectRoot();
          })
          .catch((error) => {
            removeTokens();
            redirect(error);
            handleAPIErrorAlert(error);
          });
      })
      .catch((error) => {
        redirect(error);
        handleAPIErrorAlert(error);
      });
    props.closeSignOutDialog();
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.closeSignOutDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeSignOutDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={signOut} color="secondary">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AllureDockerSignOutDialog;
