import React, { Component } from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

import AllureDockerMobileMenu from "../../components/AllureDockerMobileMenu/AllureDockerMobileMenu";
import AllureDockerToolbar from "../../components/AllureDockerToolbar/AllureDockerToolbar";
import AllureDockerProjectsSideDrawer from "../../components/AllureDockerProjectsSideDrawer/AllureDockerProjectsSideDrawer";

const drawerWidth = 240;
const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class AllureDockerBar extends Component {
  state = {
    mobileMoreAnchorEl: null,
    openSideDrawer: false,
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleMobileMenuOpen = (event) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleSideDrawerOpen = () => {
    this.setState({ openSideDrawer: true });
  };

  handleSideDrawerClose = () => {
    this.setState({ openSideDrawer: false });
  };

  render() {
    const { classes } = this.props;
    const isMobileMenuOpen = Boolean(this.state.mobileMoreAnchorEl);

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.openSideDrawer,
          })}
        >
          <AllureDockerToolbar
            title="Allure Docker Service UI"
            isSideDrawerOpen={this.state.openSideDrawer}
            handleSideDrawerOpen={this.handleSideDrawerOpen}
            handleSideDrawerClose={this.handleSideDrawerClose}
            handleMobileMenuOpen={this.handleMobileMenuOpen}
            darkState={this.props.darkState}
            handleThemeChange={this.props.handleThemeChange}
            getProjects={this.props.getProjects}
            setAPIAlert={this.props.setAPIAlert}
            isLogoutNeeded={this.props.isLogoutNeeded}
          />
        </AppBar>

        <AllureDockerMobileMenu
          isMobileMenuOpen={isMobileMenuOpen}
          anchorEl={this.state.mobileMoreAnchorEl}
          darkState={this.props.darkState}
          handleThemeChange={this.props.handleThemeChange}
          handleMobileMenuClose={this.handleMobileMenuClose}
        />

        <AllureDockerProjectsSideDrawer
          title="Allure Docker Service UI"
          projects={this.props.projects}
          isSideDrawerOpen={this.state.openSideDrawer}
          handleSideDrawerClose={this.handleSideDrawerClose}
          selectProject={this.props.selectProject}
        />

        <main
          className={clsx(classes.content, {
            [classes.contentShift]: this.state.openSideDrawer,
          })}
        >
          <div className={classes.drawerHeader} />

          {this.props.children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AllureDockerBar);
