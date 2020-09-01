import React, { Component } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import { withRouter } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";

import AllureDockerErrorPage from "../../components/AllureDockerErrorPage/AllureDockerErrorPage";
import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

const optionsSeconds = [
  { seconds: 10, text: "10 seconds" },
  { seconds: 20, text: "20 seconds" },
  { seconds: 30, text: "30 seconds" },
  { seconds: 40, text: "40 seconds" },
  { seconds: 50, text: "50 seconds" },
  { seconds: 60, text: "1 minute" },
  { seconds: 120, text: "2 minutes" },
  { seconds: 300, text: "5 minutes" },
  { seconds: 900, text: "15 minutes" },
  { seconds: 1800, text: "30 minutes" },
  { seconds: 2700, text: "45 minutes" },
  { seconds: 3600, text: "1 hour" },
  { seconds: 7200, text: "2 hours" },
  { seconds: 14400, text: "4 hours" },
  { seconds: 21600, text: "6 hours" },
  { seconds: 28800, text: "8 hours" },
  { seconds: 36000, text: "10 hours" },
  { seconds: 43200, text: "12 hours" },
  { seconds: 50400, text: "14 hours" },
  { seconds: 57600, text: "16 hours" },
  { seconds: 64800, text: "18 hours" },
  { seconds: 72000, text: "20 hours" },
  { seconds: 79200, text: "22 hours" },
  { seconds: 86400, text: "24 hours" },
];

const styles = (theme) => ({
  cardMedia: {
    height: 1000,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class AllureDockerReportFullView extends Component {
  intervalID;
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      report: {
        projectId: null,
        id: null,
      },
      error: null,
      reloadEnable: false,
      autoRefreshSeconds: optionsSeconds[0].seconds,
    };
  }

  getReport = () => {
    const projectId = this.props.match.params.id;
    const reportId = this.props.match.params.reportId;
    axios
      .get(
        `/projects/${projectId}/reports/${reportId}/index.html?redirect=false`
      )
      .then((response) => {
        const report = { ...this.state.report };
        report.projectId = projectId;
        report.id = reportId;
        this.setState({ report: report, error: null });
      })
      .catch((error) => {
        redirect(error);
        this.setState({ report: null, error: error });
      });
  };

  componentDidMount() {
    this.getReport();
  }

  componentDidUpdate() {
    this.handleReloadSwitch();
  }

  componentWillUnmount() {
    this.disableReload();
  }

  handleSwitch = () => {
    this.setState({ reloadEnable: !this.state.reloadEnable });
  };

  handleReloadSwitch = () => {
    if (this.state.reloadEnable) {
      this.enableReload();
    } else {
      this.disableReload();
    }
  };

  enableReload = () => {
    if (!this.intervalID) {
      this.intervalID = setInterval(
        this.reloadReport.bind(this),
        this.state.autoRefreshSeconds * 1000
      );
    }
  };

  disableReload = () => {
    clearInterval(this.intervalID);
    this.intervalID = undefined;
  };

  reloadReport = () => {
    this.setState({ report: null, error: null });
    this.getReport();
  };

  handleAutoRefreshSeconds = (event) => {
    const seconds = event.target.value;
    this.setState({ autoRefreshSeconds: seconds });
    this.disableReload();
  };

  goToHome = () => {
    this.props.history.push("/");
  };

  render() {
    const { classes } = this.props;

    let options = [];
    for (let option of optionsSeconds) {
      options.push(
        <option key={option.seconds} value={option.seconds}>
          {option.text}
        </option>
      );
    }

    let progress = "";
    if (this.state.progress) {
      progress = (
        <Backdrop open={true} className={classes.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }

    let content = "";
    if (
      this.state.report &&
      this.state.report.projectId &&
      this.state.report.id
    ) {
      const reportIframe = `${window._env_.ALLURE_DOCKER_API_URL}/projects/${this.state.report.projectId}/reports/${this.state.report.id}/index.html?redirect=false`;
      content = (
        <Card>
          <div align="right">
            <IconButton color="inherit" onClick={this.goToHome}>
              <HomeIcon />
            </IconButton>

            {this.state.report.id === "latest" ? (
              <React.Fragment>
                Auto Refresh
                <Switch
                  checked={this.state.reloadEnable}
                  onChange={this.handleSwitch}
                />
                <Select
                  native
                  value={this.state.autoRefreshSeconds}
                  onChange={this.handleAutoRefreshSeconds}
                  disabled={!this.state.reloadEnable}
                >
                  {options}
                </Select>
              </React.Fragment>
            ) : null}
          </div>
          <CardMedia
            className={classes.cardMedia}
            component="iframe"
            image={reportIframe}
            title="Allure Report"
          ></CardMedia>
        </Card>
      );
    }

    if (this.state.error) {
      content = <AllureDockerErrorPage error={this.state.error} />;
    }

    return (
      <React.Fragment>
        {progress}
        {content}
      </React.Fragment>
    );
  }
}
export default withStyles(styles, { withTheme: true })(
  withRouter(AllureDockerReportFullView)
);
