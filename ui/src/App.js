import React, { Component } from "react";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AllureDockerSigIn from "./components/AllureDockerSigIn/AllureDockerSigIn";
import AllureDockerMainContainer from "./containers/AllureDockerMainContainer/AllureDockerMainContainer";
import AllureDockerReportFullView from "./components/AllureDockerReportFullView/AllureDockerReportFullView";
import AllureDockerNotFound from "./components/AllureDockerNotFound/AllureDockerNotFound";
import AllureDockerErrorPage from "./components/AllureDockerErrorPage/AllureDockerErrorPage";
import axios from "./api/axios-allure-docker";

class App extends Component {
  state = {
    darkState: false,
    isLogoutNeeded: false,
    isLoginRequired: null,
    error: null,
  };

  componentDidMount() {
    this.isLoginRequired();
    this.recoverTheme();
  }

  isLoginRequired = () => {
    this.setState({ error: null });
    axios
      .get("/config")
      .then((response) => {
        const isSecurityEnabled = response.data.data.security_enabled;
        let isLogoutNeeded = false;
        if (isSecurityEnabled === 1) {
          isLogoutNeeded = true;
        } else {
          localStorage.removeItem("expirationDate");
          localStorage.removeItem("roles");
        }
        this.setState({
          isLoginRequired: false,
          isLogoutNeeded: isLogoutNeeded,
        });
      })
      .catch((error) => {
        if (error.redirect) {
          this.setState({ isLoginRequired: true, isLogoutNeeded: false });
        }
        this.setState({
          error: error,
        });
      });
  };

  recoverTheme = () => {
    const darkState = localStorage.getItem("darkState");
    this.setState({ darkState: darkState === "true" });
  };

  handleThemeChange = () => {
    const darkState = !this.state.darkState;
    this.setState({ darkState: darkState });
    localStorage.setItem("darkState", darkState);
  };

  render() {
    const mainPrimaryColor = this.state.darkState ? "#0d47a1" : "#2196f3";
    const mainSecondaryColor = this.state.darkState ? "#1e88e5" : "#0d47a1";
    const palletType = this.state.darkState ? "dark" : "light";
    const darkTheme = createMuiTheme({
      palette: {
        type: palletType,
        primary: {
          main: mainPrimaryColor,
        },
        secondary: {
          main: mainSecondaryColor,
        },
      },
    });

    let switchRouter = null;
    if (this.state.error) {
      switchRouter = <AllureDockerErrorPage error={this.state.error} />;
    }

    if (this.state.isLoginRequired !== null) {
      if (this.state.isLoginRequired) {
        switchRouter = (
          <Switch>
            <Route
              path="/signin"
              render={() => (
                <AllureDockerSigIn isLoginRequired={this.isLoginRequired} />
              )}
            />
            <Route render={() => <Redirect to="/signin" />} />
          </Switch>
        );
      } else {
        switchRouter = (
          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <AllureDockerMainContainer
                  darkState={this.state.darkState}
                  handleThemeChange={this.handleThemeChange}
                  isLogoutNeeded={this.state.isLogoutNeeded}
                />
              )}
            />
            <Route
              path="/projects/:id"
              exact
              render={() => (
                <AllureDockerMainContainer
                  darkState={this.state.darkState}
                  handleThemeChange={this.handleThemeChange}
                  isLogoutNeeded={this.state.isLogoutNeeded}
                />
              )}
            />
            <Route
              path="/projects/:id/reports/:reportId"
              exact
              render={() => <AllureDockerReportFullView />}
            />
            <Route path="/signin" exact render={() => <Redirect to="/" />} />
            <Route component={AllureDockerNotFound} />
          </Switch>
        );
      }
    }
    return (
      <React.Fragment>
        <ThemeProvider theme={darkTheme}>
          <BrowserRouter basename={window._env_.ROUTER_BASE_NAME}>
            {switchRouter}
          </BrowserRouter>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
