import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

function AllureDockerCleanResultsDialog(props) {
  const handleAPISuccessAlert = (id) => {
    props.setAPIAlert(
      "success",
      `Project ${id.toUpperCase()} - Results cleaned succesfully!`,
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

  const cleanResults = (id) => {
    props.showProgress(true);
    axios
      .get(`/clean-results?project_id=${id}`)
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
        Clean Results for Project {projectId.toUpperCase()}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to clean results?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => cleanResults(projectId)} color="secondary">
          Clean Results
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AllureDockerCleanResultsDialog;
