import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "../../api/axios-allure-docker";
import { redirect, redirectRoot } from "../../utility/navigate";

function AllureDockerDeleteProjectDialog(props) {
  const handleAPISuccessAlert = (id) => {
    props.setAPIAlert(
      "success",
      `Project ${id.toUpperCase()} deleted succesfully!`,
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

  const deleteProject = (id) => {
    props.showProgress(true);
    axios
      .delete(`/projects/${id}`)
      .then(() => {
        props.showProgress(false);
        handleAPISuccessAlert(id);
        props.getProjects();
        redirectRoot();
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
        Delete Project {projectId.toUpperCase()}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You will lose reports related to project {projectId.toUpperCase()}.
          Are you sure to delete this project?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => deleteProject(projectId)} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AllureDockerDeleteProjectDialog;
