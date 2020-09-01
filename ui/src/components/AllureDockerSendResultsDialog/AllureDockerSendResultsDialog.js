import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

const styles = (theme) => ({
  select: {
    margin: theme.spacing(1),
    minWidth: 500,
    maxWidth: 700,
  },
  error: {
    color: theme.palette.secondary.main
  }
});

class AllureDockerSendResultsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      files: [],
      error: false,
      errorMessage: "",
    };
  }

  sendResults = (event, projectId) => {
    event.preventDefault();

    this.props.showProgress(true);

    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    for (let file of this.state.files) {
      formData.append("files[]", file);
    }

    axios
      .post(`/send-results?project_id=${projectId}`, formData, config)
      .then((response) => {
        this.resetStates();
        this.props.handleCloseDialog();
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
  };

  handleFiles = (event) => {
    let files = [];
    for (let file of event.target.files) {
      files.push(file);
    }
    this.setState({ files: files });
  };

  resetStates = () => {
    this.setState(this.initialState);
  };

  handleCloseDialog = () => {
    this.props.handleCloseDialog();
    this.resetStates();
  };

  handleAPISuccessAlert = (projectId) => {
    this.props.setAPIAlert(
      "success",
      `Project ${projectId.toUpperCase()} - Results sent succesfully!`,
      true
    );
  };

  handleAPIErrorAlert = (error) => {
    this.setState({ errorMessage: error.message, error: true });
  };

  render() {
    const { classes } = this.props;

    let projectId = "";
    if (this.props.projectId) {
      projectId = this.props.projectId;
    }

    let files = [<option key="default">Select files...</option>];
    if (this.state.files.length !== 0) {
      files = [];
      for (let file of this.state.files) {
        files.push(<option key={file.name}>{file.name}</option>);
      }
    }

    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={(event) => this.sendResults(event, projectId)}>
          <DialogTitle id="form-dialog-title">
            Send Results for Project {projectId.toUpperCase()}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Upload your file results.</DialogContentText>
            <div>
              <Select
                className={classes.select}
                native
                inputProps={{
                  id: "select-multiple-native",
                }}
                multiple
                variant="filled"
              >
                {files}
              </Select>
            </div>
            <div align="right">
              <Button variant="contained" component="label">
                Upload Files
                <input
                  type="file"
                  onChange={this.handleFiles}
                  style={{ display: "none" }}
                  multiple
                />
              </Button>
              <FormHelperText id="component-error" className={classes.error}>
                {this.state.errorMessage}
              </FormHelperText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="secondary">
              Send Results
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(AllureDockerSendResultsDialog)
);
