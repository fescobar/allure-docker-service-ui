import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { withRouter } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

class AllureDockerConfigDialog extends Component {
  state = {
    config: null,
  };

  componentDidUpdate() {
    if (this.props.open && !this.state.config) {
      this.getConfig();
    }
  }

  getConfig = () => {
    axios
      .get("/config")
      .then((response) => {
        this.setState({ config: response.data.data });
      })
      .catch((error) => {
        redirect(error);
        this.handleCloseDialog();
        this.handleAPIErrorAlert(error);
      });
  };

  handleAPIErrorAlert = (error) => {
    this.props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  handleCloseDialog = () => {
    this.props.closeConfigDialog();
    this.setState({ config: null });
  };

  render() {
    let config = [];
    if (this.state.config) {
      for (const [key, value] of Object.entries(this.state.config)) {
        config.push({ key, value });
      }
    }
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Allure Docker Server Configuration
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {config.map((row) => (
                <TableRow key={row.key}>
                  <TableCell component="th" scope="row">
                    {row.key}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(AllureDockerConfigDialog);
