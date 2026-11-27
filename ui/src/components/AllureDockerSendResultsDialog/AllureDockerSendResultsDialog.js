import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

function AllureDockerSendResultsDialog(props) {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const resetStates = () => {
    setFiles([]);
    setErrorMessage("");
  };

  const handleCloseDialog = () => {
    props.handleCloseDialog();
    resetStates();
  };

  const handleAPISuccessAlert = (id) => {
    props.setAPIAlert(
      "success",
      `Project ${id.toUpperCase()} - Results sent succesfully!`,
      true
    );
  };

  const sendResults = (event, id) => {
    event.preventDefault();
    props.showProgress(true);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    for (let file of files) {
      formData.append("files[]", file);
    }

    axios
      .post(`/send-results?project_id=${id}`, formData, config)
      .then(() => {
        resetStates();
        props.handleCloseDialog();
        props.showProgress(false);
        handleAPISuccessAlert(id);
        props.getProjects();
        props.refreshProject();
      })
      .catch((error) => {
        redirect(error);
        props.showProgress(false);
        setErrorMessage(error.message);
      });
  };

  const handleFiles = (event) => {
    const selectedFiles = [];
    for (let file of event.target.files) {
      selectedFiles.push(file);
    }
    setFiles(selectedFiles);
  };

  const projectId = props.projectId || "";
  const fileOptions =
    files.length !== 0
      ? files.map((file) => <option key={file.name}>{file.name}</option>)
      : [<option key="default">Select files...</option>];

  return (
    <Dialog
      open={props.open}
      onClose={handleCloseDialog}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={(event) => sendResults(event, projectId)}>
        <DialogTitle id="form-dialog-title">
          Send Results for Project {projectId.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Upload your file results.</DialogContentText>
          <div>
            <Select
              sx={{ m: 1, minWidth: 500, maxWidth: 700 }}
              native
              slotProps={{
                input: {
                  id: "select-multiple-native",
                },
              }}
              multiple
              variant="filled"
            >
              {fileOptions}
            </Select>
          </div>
          <div align="right">
            <Button variant="contained" component="label">
              Upload Files
              <input
                type="file"
                onChange={handleFiles}
                style={{ display: "none" }}
                multiple
              />
            </Button>
            <FormHelperText id="component-error" sx={{ color: "secondary.main" }}>
              {errorMessage}
            </FormHelperText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
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

export default AllureDockerSendResultsDialog;
