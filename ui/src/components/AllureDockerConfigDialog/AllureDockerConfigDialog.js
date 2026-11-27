import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import localAxios from "axios";

import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

function AllureDockerConfigDialog(props) {
  const [apiConfig, setApiConfig] = useState(null);
  const [config, setConfig] = useState(null);

  const handleCloseDialog = () => {
    props.closeConfigDialog();
    setConfig(null);
    setApiConfig(null);
  };

  const handleAPIErrorAlert = (error) => {
    props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  useEffect(() => {
    if (props.open && !config && !apiConfig) {
      localAxios
        .create()
        .get(`${process.env.PUBLIC_URL}/config.json`)
        .then((response) => {
          setConfig(response.data);
        })
        .catch((error) => {
          handleCloseDialog();
          handleAPIErrorAlert(error);
        });

      axios
        .get("/config")
        .then((response) => {
          setApiConfig(response.data.data);
        })
        .catch((error) => {
          redirect(error);
          handleCloseDialog();
          handleAPIErrorAlert(error);
        });
    }
  });

  const configRows = config
    ? Object.entries(config).map(([key, value]) => ({ key, value }))
    : [];

  const apiConfigRows = apiConfig
    ? Object.entries(apiConfig).map(([key, value]) => ({ key, value }))
    : [];

  return (
    <Dialog
      open={props.open}
      onClose={handleCloseDialog}
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
            {configRows.map((row) => (
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
            {apiConfigRows.map((row) => (
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
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AllureDockerConfigDialog;
