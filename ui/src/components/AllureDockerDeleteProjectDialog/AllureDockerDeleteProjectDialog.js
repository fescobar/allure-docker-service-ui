import React, { Component } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { withRouter } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import { redirect, redirectRoot } from "../../utility/navigate"

class AllureDockerDeleteProjectDialog extends Component {
  deleteProject = (projectId) => {
    this.props.showProgress(true);
    axios
      .delete(`/projects/${projectId}`)
      .then((response) => {
        this.props.showProgress(false);
        this.handleAPISuccessAlert(projectId);
        this.props.getProjects();
        redirectRoot();
      })
      .catch((error) => {
        redirect(error);
        this.props.showProgress(false);
        this.handleAPIErrorAlert(error);
      });
    this.props.handleCloseDialog();
  };

  handleCloseDialog = () => {
    this.props.handleCloseDialog();
  };

  handleAPISuccessAlert = (projectId) => {
    this.props.setAPIAlert(
      "success",
      `Project ${projectId.toUpperCase()} deleted succesfully!`,
      true
    );
  };

  handleAPIErrorAlert = (error) => {
    this.props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  render() {
    let projectId = "";
    if (this.props.projectId) {
      projectId = this.props.projectId;
    }

    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleCloseDialog}
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
          <Button onClick={this.handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => this.deleteProject(projectId)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withRouter(AllureDockerDeleteProjectDialog);
