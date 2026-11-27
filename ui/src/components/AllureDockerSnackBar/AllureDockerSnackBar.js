import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

function AllureDockerSnackBar(props) {
  const { show, duration, severity, message, resetAPIAlert } = props;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    resetAPIAlert();
  };

  return (
    <Box sx={{ width: "100%", "& > * + *": { mt: 2 } }}>
      <Snackbar
        open={show}
        autoHideDuration={duration}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert severity={severity} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AllureDockerSnackBar;
