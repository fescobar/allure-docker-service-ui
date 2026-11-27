import React, { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import FormHelperText from "@mui/material/FormHelperText";
import HomeIcon from "@mui/icons-material/Home";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { setRoles } from "../../utility/user-actions";
import { redirectRoot } from "../../utility/navigate";

import axios from "../../api/axios-allure-docker";
import allure from "../../assets/images/allure.png";
import docker from "../../assets/images/docker.png";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link
        color="inherit"
        href="https://github.com/fescobar/allure-docker-service-ui"
      >
        Allure Docker Service UI
      </Link>{" "}
      {new Date().getFullYear()}
      {" (The best year ever)"}
    </Typography>
  );
}

function AllureDockerSignIn(props) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signin = (event) => {
    event.preventDefault();
    axios
      .post("/login", {
        username,
        password,
      })
      .then((response) => {
        const expiresIn = response.data.data.expires_in;
        if (expiresIn !== 0) {
          const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
          );
          localStorage.setItem("expirationDate", expirationDate);
        }
        setRoles(response.data.data.roles);
        props.isLoginRequired();
        navigate("/", { replace: true });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div align="center">
            <img src={allure} alt="allure" height="100" />
            <img src={docker} alt="docker" height="100" />
          </div>
          <Typography component="h1" variant="h5" align="center">
            Allure Docker Service UI
          </Typography>
          <Box
            component="form"
            sx={{ width: "100%", mt: 1 }}
            noValidate
            onSubmit={signin}
          >
            <TextField
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="user"
              label="User"
              name="user"
              autoComplete="user"
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(event) => setPassword(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormHelperText sx={{ color: "secondary.main" }}>
              {errorMessage}
            </FormHelperText>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          {props.isHomeAnOption ? (
            <IconButton color="inherit" onClick={redirectRoot}>
              <HomeIcon />
            </IconButton>
          ) : null}
        </Box>
        <Box sx={{ mt: 8 }}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}

export default AllureDockerSignIn;
