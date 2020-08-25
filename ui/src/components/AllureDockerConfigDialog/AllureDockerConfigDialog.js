import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withRouter } from "react-router-dom";
import localAxios from "axios";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

class AllureDockerConfigDialog extends Component {
  state = {
    apiConfig: null,
    config: null,
  };

  componentDidUpdate() {
    if (this.props.open && !this.state.config && !this.state.apiConfig) {
      this.getConfig();
      this.getAPIConfig();
    }
  }

  getConfig = () => {
    const axios = localAxios.create();
    axios
      .get(`${process.env.PUBLIC_URL}/config.json`)
      .then((response) => {
        this.setState({ config: response.data });
      })
      .catch((error) => {
        this.handleCloseDialog();
        this.handleAPIErrorAlert(error);
      });
  };

  getAPIConfig = () => {
    axios
      .get("/config")
      .then((response) => {
        this.setState({ apiConfig: response.data.data });
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
    this.setState({ config: null, apiConfig: null });
  };

  render() {
    let config = [];
    if (this.state.config) {
      for (const [key, value] of Object.entries(this.state.config)) {
        config.push({ key, value });
      }
    }

    let apiConfig = [];
    if (this.state.apiConfig) {
      for (const [key, value] of Object.entries(this.state.apiConfig)) {
        apiConfig.push({ key, value });
      }
    }
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Configuration</DialogTitle>
        <DialogContent>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: 6 }}>UI</TableCell>
                <TableCell style={{ padding: 6 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config.map((row) => (
                <TableRow key={row.key}>
                  <TableCell style={{ padding: 4 }} component="th" scope="row">
                    {row.key}
                  </TableCell>
                  <TableCell style={{ padding: 4 }} align="right">
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogContent>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: 6 }}>API</TableCell>
                <TableCell style={{ padding: 6 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiConfig.map((row) => (
                <TableRow key={row.key}>
                  <TableCell style={{ padding: 4 }} component="th" scope="row">
                    {row.key}
                  </TableCell>
                  <TableCell style={{ padding: 4 }} align="right">
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(AllureDockerConfigDialog);
