import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class AllureDockerInfoDialog extends Component {

  handleCloseDialog = () => {
    this.props.handleCloseDialog();
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          INFO
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {//TODO
            }
            https://github.com/fescobar/allure-docker-service
            https://gitter.im/allure-docker-service/community
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default AllureDockerInfoDialog;
