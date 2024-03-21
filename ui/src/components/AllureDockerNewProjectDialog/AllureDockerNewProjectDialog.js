import React, { Component } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { withRouter } from "react-router-dom";
import { withStyles } from "@mui/material/styles";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

const styles = (theme) => ({
  formLabel: {
    color: theme.palette.secondary.main,
    "&.Mui-focused": {
      color: theme.palette.secondary.main,
    },
  },
});
class AllureDockerNewProjectDialog extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      projectIdTextField: {
        value: "",
        error: false,
        errorMessage: "",
      },
    };
  }

  createProject = () => {
    axios
      .post("/projects", {
        id: this.state.projectIdTextField.value.toLowerCase(),
      })
      .then((response) => {
        this.resetStates();
        this.props.closeNewProjectDialog();
        this.props.getProjects();

        const projectId = response.data.data.id;
        this.props.history.replace(`/projects/${projectId}`);
        this.props.setAPIAlert(
          "success",
          `Project ${projectId.toUpperCase()} created succesfully!`,
          true
        );
      })
      .catch((error) => {
        redirect(error);
        this.showProjectIdTextFieldError(error.message);
      });
  };

  handleProjectIdTextFieldChange = (event) => {
    const projectIdTextField = { ...this.state.projectIdTextField };
    projectIdTextField.value = event.target.value;
    this.setState({ projectIdTextField: projectIdTextField });
  };

  showProjectIdTextFieldError = (errorMessage) => {
    const projectIdTextField = { ...this.state.projectIdTextField };
    projectIdTextField.error = true;
    projectIdTextField.errorMessage = errorMessage;
    this.setState({ projectIdTextField: projectIdTextField });
  };

  resetStates = () => {
    this.setState(this.initialState);
  };

  handleCloseDialog = () => {
    this.props.closeNewProjectDialog();
    this.resetStates();
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create a New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The projects allow you to organize your tests in a better way.
          </DialogContentText>
          <TextField
            error={this.state.projectIdTextField.error}
            value={this.state.projectIdTextField.value}
            autoFocus
            margin="dense"
            id="projectId"
            label="Project ID"
            type="string"
            onChange={this.handleProjectIdTextFieldChange}
            fullWidth
            aria-describedby="component-error-project-id"
            InputLabelProps={{
              className: classes.formLabel,
            }}
          />
          <FormHelperText id="component-error-project-id">
            {this.state.projectIdTextField.errorMessage}
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.createProject} color="secondary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withStyles(styles, { withTheme: true })(
  withRouter(AllureDockerNewProjectDialog)
);
