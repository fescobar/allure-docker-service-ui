import React, { Component } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { withRouter } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate"

class AllureDockerCleanResultsDialog extends Component {
  cleanResults = (projectId) => {
    this.props.showProgress(true);
    axios
      .get(`/clean-results?project_id=${projectId}`)
      .then((response) => {
        this.props.showProgress(false);
        this.handleAPISuccessAlert(projectId);
        this.props.getProjects();
        this.props.refreshProject();
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
      `Project ${projectId.toUpperCase()} - Results cleaned succesfully!`,
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
          Clean Results for Project {projectId.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clean results?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => this.cleanResults(projectId)} color="secondary">
            Clean Results
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withRouter(AllureDockerCleanResultsDialog);
