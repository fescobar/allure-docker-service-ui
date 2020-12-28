import React, { Component } from "react";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { setRoles } from "../../utility/user-actions";

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

  componentDidMount() {}

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

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <div align="center">
              <img src={allure} alt="allure" height="100"/>
              <img src={docker} alt="docker" height="100"/>
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
