import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

const initialProjectIdTextField = {
  value: "",
  error: false,
  errorMessage: "",
};

function AllureDockerNewProjectDialog(props) {
  const navigate = useNavigate();
  const [projectIdTextField, setProjectIdTextField] = useState(
    initialProjectIdTextField
  );

  const resetStates = () => {
    setProjectIdTextField(initialProjectIdTextField);
  };

  const handleCloseDialog = () => {
    props.closeNewProjectDialog();
    resetStates();
  };

  const createProject = () => {
    axios
      .post("/projects", {
        id: projectIdTextField.value.toLowerCase(),
      })
      .then((response) => {
        resetStates();
        props.closeNewProjectDialog();
        props.getProjects();

        const projectId = response.data.data.id;
        navigate(`/projects/${projectId}`, { replace: true });
        props.setAPIAlert(
          "success",
          `Project ${projectId.toUpperCase()} created succesfully!`,
          true
        );
      })
      .catch((error) => {
        redirect(error);
        setProjectIdTextField((prev) => ({
          ...prev,
          error: true,
          errorMessage: error.message,
        }));
      });
  };

  const handleProjectIdTextFieldChange = (event) => {
    const value = event.target.value;
    setProjectIdTextField((prev) => ({ ...prev, value }));
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleCloseDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create a New Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The projects allow you to organize your tests in a better way.
        </DialogContentText>
        <TextField
          error={projectIdTextField.error}
          value={projectIdTextField.value}
          autoFocus
          margin="dense"
          id="projectId"
          label="Project ID"
          type="string"
          onChange={handleProjectIdTextFieldChange}
          fullWidth
          aria-describedby="component-error-project-id"
          slotProps={{
            inputLabel: {
              sx: {
                color: "secondary.main",
                "&.Mui-focused": {
                  color: "secondary.main",
                },
              },
            },
          }}
        />
        <FormHelperText id="component-error-project-id">
          {projectIdTextField.errorMessage}
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={createProject} color="secondary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AllureDockerNewProjectDialog;
