import React, { Component } from "react";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { setViewerRole } from "./utility/user-actions";
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
    isSignInAnOption: false,
    isLoginRequired: null,
    error: null,
  };

  componentDidMount() {
    this.isLoginRequired();
    this.recoverTheme();
  }

  isAdminEndpointAccessible = () => {
    return axios
      .post("/send-results")
      .then((response) => {
        return response.status !== 401;
      })
      .catch((error) => {
        return error.status !== 401;
      });
  }

  isLoginRequired = () => {
    this.setState({ error: null });
    axios
      .get("/config")
      .then(async (response) => {
        const isSecurityEnabled = response.data.data.security_enabled;
        let isLogoutNeeded = false;
        let isSignInAnOption = false;
        if (isSecurityEnabled === 1) {
          isLogoutNeeded = true;
          const isMakeViewerEndpointsPublic = response.data.data.make_viewer_endpoints_public;
          if (isMakeViewerEndpointsPublic === 1 && !await this.isAdminEndpointAccessible()) {
            setViewerRole();
            isLogoutNeeded = false;
            isSignInAnOption = true;
          }
        } else {
          localStorage.removeItem("expirationDate");
          localStorage.removeItem("roles");
        }
        this.setState({
          isLoginRequired: false,
          isLogoutNeeded: isLogoutNeeded,
          isSignInAnOption: isSignInAnOption
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
                <AllureDockerSigIn isLoginRequired={this.isLoginRequired}/>
              )}
            />
            <Route render={() => <Redirect to="/signin" />} />
          </Switch>
        );
      } else {
        let signInAnOption;
        if (this.state.isSignInAnOption) {
          signInAnOption = (
            <React.Fragment>
              <Route
                path="/signin"
                render={() => (
                  <AllureDockerSigIn isLoginRequired={this.isLoginRequired} isHomeAnOption={!this.isSignInAnOption}/>
                )}
              />
            </React.Fragment>
          )
        } else {
          signInAnOption = (<Route path="/signin" exact render={() => <Redirect to="/" />} />)
        }

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
                  isSignInAnOption={this.state.isSignInAnOption}
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
                  isSignInAnOption={this.state.isSignInAnOption}
                />
              )}
            />
            <Route
              path="/projects/:id/reports/:reportId"
              exact
              render={() => <AllureDockerReportFullView />}
            />
            {signInAnOption}
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
