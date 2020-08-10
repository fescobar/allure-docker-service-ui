import React, { Component } from "react";
import clsx from "clsx";
import { fade, withStyles } from "@material-ui/core/styles";
import AddCircle from "@material-ui/icons/AddCircle";
import Divider from "@material-ui/core/Divider";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import InputBase from "@material-ui/core/InputBase";
import LanguageIcon from "@material-ui/icons/Language";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";

import SwaggerLogo from "../../components/SwaggerLogo/SwaggerLogo";

import AllureDockerNewProjectDialog from "../AllureDockerNewProjectDialog/AllureDockerNewProjectDialog";
import AllureDockerConfigDialog from "../AllureDockerConfigDialog/AllureDockerConfigDialog";
import AllureDockerInfoDialog from "../AllureDockerInfoDialog/AllureDockerInfoDialog";
import AllureDockerLanguagesMenu from "../AllureDockerLanguagesMenu/AllureDockerLanguagesMenu";
import AllureDockerSignOutDialog from "../AllureDockerSignOutDialog/AllureDockerSignOutDialog";
import { redirectRoot } from "../../utility/navigate";

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
});

class AllureDockerToolbar extends Component {
  state = {
    newProjectDialog: false,
    configDialog: false,
    signOutDialog: false,
    infoDialog: false,
    languagesAnchorEl: null,
  };

  openNewProjectDialog = () => {
    this.setState({ newProjectDialog: true });
  };

  closeNewProjectDialog = () => {
    this.setState({ newProjectDialog: false });
  };

  openConfigDialog = () => {
    this.setState({ configDialog: true });
  };

  closeConfigDialog = () => {
    this.setState({ configDialog: false });
  };

  openSignOutDialog = () => {
    this.setState({ signOutDialog: true });
  };

  closeSignOutDialog = () => {
    this.setState({ signOutDialog: false });
  };

  openInfoDialog = () => {
    this.setState({ infoDialog: true });
  };

  closeInfoDialog = () => {
    this.setState({ infoDialog: false });
  };

  closeLanguagesMenu = () => {
    this.setState({ languagesAnchorEl: null });
  };

  openLanguagesMenu = (event) => {
    this.setState({ languagesAnchorEl: event.currentTarget });
  };

  goToSwagger = () => {
    window.open(`${window._env_.ALLURE_DOCKER_API_URL}/swagger`, "_blank");
  };

  goToHome = () => {
    redirectRoot();
  };

  render() {
    const { classes } = this.props;

    let signOutButton = "";
    if (this.props.isLogoutNeeded) {
      signOutButton = (
        <IconButton color="inherit" onClick={this.openSignOutDialog}>
          <ExitToAppIcon />
        </IconButton>
      );
    }

    return (
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={this.props.handleSideDrawerOpen}
          edge="start"
          className={clsx(
            classes.menuButton,
            this.props.isSideDrawerOpen && classes.hide
          )}
        >
          <MenuIcon />
        </IconButton>

        <Typography className={classes.title} variant="h6" noWrap>
          {this.props.title}
        </Typography>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Project ID…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </div>

        <div className={classes.grow} />

        <IconButton color="inherit" onClick={this.goToHome}>
          <HomeIcon />
        </IconButton>

        <IconButton color="inherit" onClick={this.openNewProjectDialog}>
          <AddCircle />
        </IconButton>

        <IconButton color="inherit" onClick={this.openConfigDialog}>
          <SettingsIcon />
        </IconButton>

        {signOutButton}
        <Divider orientation="vertical" flexItem />

        <div className={classes.sectionDesktop}>
          <IconButton color="inherit">
            <Switch
              checked={this.props.darkState}
              onChange={this.props.handleThemeChange}
            />
          </IconButton>

          <IconButton color="inherit" onClick={this.openLanguagesMenu}>
            <LanguageIcon />
          </IconButton>

          <Divider orientation="vertical" flexItem />

          <IconButton color="inherit" onClick={this.openInfoDialog}>
            <InfoIcon />
          </IconButton>

          <IconButton color="inherit" onClick={this.goToSwagger}>
            <SwaggerLogo height="100%" />
          </IconButton>
        </div>

        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="show more"
            aria-controls="primary-search-account-menu-mobile"
            aria-haspopup="true"
            onClick={this.props.handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
          <AllureDockerNewProjectDialog
            setAPIAlert={this.props.setAPIAlert}
            open={this.state.newProjectDialog}
            closeNewProjectDialog={this.closeNewProjectDialog}
            getProjects={this.props.getProjects}
          />
          <AllureDockerConfigDialog
            setAPIAlert={this.props.setAPIAlert}
            open={this.state.configDialog}
            closeConfigDialog={this.closeConfigDialog}
          />
          <AllureDockerSignOutDialog
            setAPIAlert={this.props.setAPIAlert}
            open={this.state.signOutDialog}
            closeSignOutDialog={this.closeSignOutDialog}
          />
          <AllureDockerInfoDialog
            open={this.state.infoDialog}
            handleCloseDialog={this.closeInfoDialog}
          />
          <AllureDockerLanguagesMenu
            closeLanguagesMenu={this.closeLanguagesMenu}
            anchorEl={this.state.languagesAnchorEl}
          />
        </div>
      </Toolbar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(AllureDockerToolbar)
);
