import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import localAxios from "axios";

function AllureDockerInfoDialog(props) {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    if (!version) {
      localAxios
        .create()
        .get(`${process.env.PUBLIC_URL}/config.json`)
        .then((response) => {
          setVersion(response.data.version);
        })
        .catch(() => {
          setVersion("NOT_FOUND");
        });
    }
  }, [version]);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleCloseDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">INFO</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography
            component="span"
            variant="h6"
            color="textSecondary"
            align="left"
          >
            Allure UI Version
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            align="center"
          >
            {version}
          </Typography>
        </DialogContentText>
        <DialogContentText>
          <Typography
            component="span"
            variant="h6"
            color="textSecondary"
            align="left"
          >
            Support
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            align="center"
          >
            <Link
              color="inherit"
              href="https://gitter.im/allure-docker-service/community"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://gitter.im/allure-docker-service/community
            </Link>
          </Typography>
        </DialogContentText>
        <DialogContentText>
          <Typography
            component="span"
            variant="h6"
            color="textSecondary"
            align="left"
          >
            UI
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            align="center"
          >
            <Link
              color="inherit"
              href="https://github.com/fescobar/allure-docker-service-ui"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://github.com/fescobar/allure-docker-service-ui
            </Link>
          </Typography>
        </DialogContentText>
        <DialogContentText>
          <Typography
            component="span"
            variant="h6"
            color="textSecondary"
            align="left"
          >
            API
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            align="center"
          >
            <Link
              color="inherit"
              href="https://github.com/fescobar/allure-docker-service"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://github.com/fescobar/allure-docker-service
            </Link>
          </Typography>
        </DialogContentText>
        <DialogContentText>
          <Typography
            component="span"
            variant="h6"
            color="textSecondary"
            align="left"
          >
            Examples
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            align="center"
          >
            <Link
              color="inherit"
              href="https://github.com/fescobar/allure-docker-service-examples"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://github.com/fescobar/allure-docker-service-examples
            </Link>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogTitle id="form-dialog-title">AUTHOR</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography
            component="span"
            variant="body1"
            color="textSecondary"
            align="left"
          >
            {"Frank Escobar"}
          </Typography>
          <Typography
            variant="subtitle2"
            color="secondary"
            align="center"
          >
            <Link
              color="inherit"
              href="https://www.linkedin.com/in/fescobarsystems/"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </Link>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCloseDialog} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AllureDockerInfoDialog;
