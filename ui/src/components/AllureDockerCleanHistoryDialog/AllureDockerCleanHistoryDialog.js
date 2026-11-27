import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

function AllureDockerCleanHistoryDialog(props) {
  const handleAPISuccessAlert = (id) => {
    props.setAPIAlert(
      "success",
      `Project ${id.toUpperCase()} - History cleaned succesfully!`,
      true
    );
  };

  const handleAPIErrorAlert = (error) => {
    props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  const cleanHistory = (id) => {
    props.showProgress(true);
    axios
      .get(`/clean-history?project_id=${id}`)
      .then(() => {
        props.showProgress(false);
        handleAPISuccessAlert(id);
        props.getProjects();
        props.refreshProject();
      })
      .catch((error) => {
        redirect(error);
        props.showProgress(false);
        handleAPIErrorAlert(error);
      });
    props.handleCloseDialog();
  };

  const projectId = props.projectId || "";

  return (
    <Dialog
      open={props.open}
      onClose={props.handleCloseDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Clean History for Project {projectId.toUpperCase()}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to clean history?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => cleanHistory(projectId)} color="secondary">
          Clean History
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AllureDockerCleanHistoryDialog;
