import React, { Component } from "react";
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
import { withStyles } from "@mui/material/styles";
import {withRouter} from "react-router-dom";
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

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: theme.palette.secondary.main,
  },
});

class AllureDockerSignIn extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      error: false,
      errorMessage: "",
      userTextField: {
        value: "",
      },
      passTextField: {
        value: "",
        show: false,
      },
    };
  }

  componentDidMount() { }

  signin = (event) => {
    event.preventDefault();
    axios
      .post("/login", {
        username: this.state.userTextField.value,
        password: this.state.passTextField.value,
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
        this.props.isLoginRequired();
        this.props.history.replace("/");
      })
      .catch((error) => {
        this.showError(error.message);
      });
  };

  handleUserTextFieldChange = (event) => {
    const userTextField = { ...this.state.userTextField };
    userTextField.value = event.target.value;
    this.setState({ userTextField: userTextField });
  };

  handlePassTextFieldChange = (event) => {
    const passTextField = { ...this.state.passTextField };
    passTextField.value = event.target.value;
    this.setState({ passTextField: passTextField });
  };

  handleClickShowPassword = () => {
    const passTextField = { ...this.state.passTextField };
    passTextField.show = !this.state.passTextField.show;
    this.setState({ passTextField: passTextField });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  showError = (errorMessage) => {
    this.setState({ error: true, errorMessage });
  };

  resetStates = () => {
    this.setState(this.initialState);
  };

  goToHome = () => {
    redirectRoot();
  };

  render() {
    const { classes } = this.props;

    let isHomeAnOption;
    if (this.props.isHomeAnOption) {
      isHomeAnOption = (
        <IconButton color="inherit" onClick={this.goToHome}>
          <HomeIcon />
        </IconButton>
      );
    }

    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <div align="center">
              <img src={allure} alt="allure" height="100" />
              <img src={docker} alt="docker" height="100" />
            </div>
            <Typography component="h1" variant="h5" align="center">
              Allure Docker Service UI
            </Typography>
            <form className={classes.form} noValidate onSubmit={this.signin}>
              <TextField
                error={this.state.userTextField.error}
                value={this.state.userTextField.value}
                onChange={this.handleUserTextFieldChange}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user"
                label="User"
                name="user"
                autoComplete="user"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                error={this.state.passTextField.error}
                value={this.state.passTextField.value}
                type={this.state.passTextField.show ? "text" : "password"}
                onChange={this.handlePassTextFieldChange}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.passTextField.show ? (
                          <Visibility />
                        ) : (
                            <VisibilityOff />
                          )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormHelperText className={classes.error}>
                {this.state.errorMessage}
              </FormHelperText>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Sign In
              </Button>
            </form>
            {isHomeAnOption}
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(AllureDockerSignIn)
);
