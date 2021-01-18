import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import AllureDockerBar from "../../containers/AllureDockerBar/AllureDockerBar";
import AllureDockerProject from "../../containers/AllureDockerProject/AllureDockerProject";
import AllureDockerSnackBar from "../../components/AllureDockerSnackBar/AllureDockerSnackBar";
import AllureDockerHomePage from "../../components/AllureDockerHomePage/AllureDockerHomePage"
import { redirect } from "../../utility/navigate"

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(5),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
});

const autoHideDurationSuccessAlert = 3000;
const autoHideDurationErrorAlert = 6000;
const autoHideDurationInfoAlert = 3000;
class AllureDockerMainContainer extends Component {
  state = {
    projects: [],
    projectSelected: null,
    apiAlert: {
      severity: "info",
      show: false,
      message: "",
      duration: 0,
    }
  };

  componentDidMount() {
    this.getProjects();
  }

  selectProject = (projectId) => {
    this.setState({ projectSelected: projectId });
  };

  getProjects = () => {
    axios
      .get("/projects")
      .then((response) => {
        const projects = response.data.data.projects;
        this.setState({
          projects: response.data.data.projects,
          projectSelected: null,
        });
        if (projects.length !== 0) {
          this.selectProject(Object.keys(projects)[0]);
        }
      })
      .catch((error) => {
        redirect(error);
        this.setAPIAlert("error", error.message, true);
      });
  };

  setAPIAlert = (severity, message, show) => {
    const apiAlert = { ...this.state.apiAlert };
    apiAlert.severity = severity;
    apiAlert.show = show;
    apiAlert.message = message;
    if (severity === "success") {
      apiAlert.duration = autoHideDurationSuccessAlert;
    }
    if (severity === "error") {
      apiAlert.duration = autoHideDurationErrorAlert;
    }
    if (severity === "info") {
      apiAlert.duration = autoHideDurationInfoAlert;
    }
    this.setState({ apiAlert: apiAlert });
  };

  resetAPIAlert = () => {
    const apiAlert = { ...this.state.apiAlert };
    apiAlert.show = false;
    apiAlert.message = "";
    apiAlert.duration = 0;
    this.setState({ apiAlert: apiAlert });
  };

  render() {
    const { classes } = this.props;

    let projects = [];
    if (this.state.projects) {
      projects = this.state.projects;
    }

    const allureProject = (
      <AllureDockerProject
        setAPIAlert={this.setAPIAlert}
        getProjects={this.getProjects}
      />
    );

    let content = <AllureDockerHomePage/>;
    if (this.props.match.params.id) {
      content = allureProject;
    }

    const allureDocker = (
      <AllureDockerBar
        projects={projects}
        getProjects={this.getProjects}
        darkState={this.props.darkState}
        handleThemeChange={this.props.handleThemeChange}
        selectProject={this.selectProject}
        setAPIAlert={this.setAPIAlert}
        isLogoutNeeded={this.props.isLogoutNeeded}
        isSignInAnOption={this.props.isSignInAnOption}
      >
        <main className={classes.content}>
          <AllureDockerSnackBar
            severity={this.state.apiAlert.severity}
            show={this.state.apiAlert.show}
            message={this.state.apiAlert.message}
            duration={this.state.apiAlert.duration}
            resetAPIAlert={this.resetAPIAlert}
          />
          {content}
        </main>
      </AllureDockerBar>
    );
    return (
      <React.Fragment>
        {allureDocker}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(AllureDockerMainContainer)
);
