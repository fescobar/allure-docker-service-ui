import React, { Component } from "react";
import clsx from "clsx";
import { withStyles } from "@mui/material//styles";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddCircle from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { withRouter } from "react-router-dom";
import { isAdmin } from "../../utility/user-actions";

import SwaggerLogo from "../../components/SwaggerLogo/SwaggerLogo";

import AllureDockerNewProjectDialog from "../AllureDockerNewProjectDialog/AllureDockerNewProjectDialog";
import AllureDockerConfigDialog from "../AllureDockerConfigDialog/AllureDockerConfigDialog";
import AllureDockerInfoDialog from "../AllureDockerInfoDialog/AllureDockerInfoDialog";
import AllureDockerLanguagesMenu from "../AllureDockerLanguagesMenu/AllureDockerLanguagesMenu";
import AllureDockerSignOutDialog from "../AllureDockerSignOutDialog/AllureDockerSignOutDialog";
import { redirect, redirectRoot } from "../../utility/navigate";
import axios from "../../api/axios-allure-docker";

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
  searchTextField: {
    color: "inherit",
    padding: theme.spacing(0.5),
    paddingLeft: `calc(1em + ${theme.spacing(5)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
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
    searchResults: [],
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

  goToSignIn = () => {
    this.props.history.push(`/signin`);
  }

  handleAPIErrorAlert = (error) => {
    this.props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  handleSearch = (event, id) => {
    axios
      .get(`/projects/search?id=${id}`)
      .then((response) => {
        const projects = response.data.data.projects;
        const searchResults = [];
        for (const id in projects) {
          searchResults.push(id);
        }
        this.setState({ searchResults: searchResults });
      })
      .catch((error) => {
        redirect(error);
        if (error.status !== 404) {
          this.handleAPIErrorAlert(error);
        }
        this.setState({ searchResults: [] });
      });
  };

  handleSearchValue = (event, value) => {
    if (value) {
      this.props.history.push(`/projects/${value}`);
    }
  };

  render() {
    const { classes } = this.props;

    let isSignInAnOption = "";
    if (this.props.isSignInAnOption) {
      isSignInAnOption = (
        <IconButton color="inherit" onClick={this.goToSignIn}>
          <AccountCircle />
        </IconButton>
      );
    }

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
          <Autocomplete
            className={classes.searchTextField}
            options={this.state.searchResults}
            onInputChange={this.handleSearch}
            onChange={this.handleSearchValue}
            noOptionsText={'project not found'}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Project ID..."
                margin="none"
                variant="standard"
                InputProps={{ ...params.InputProps, disableUnderline: true }}
              />
            )}
          />
        </div>

        <div className={classes.grow} />

        <IconButton color="inherit" onClick={this.goToHome}>
          <HomeIcon />
        </IconButton>

        {isSignInAnOption}

        <IconButton color="inherit" onClick={this.openNewProjectDialog} disabled={!isAdmin()}>
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
            setAPIAlert={this.props.setAPIAlert}
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
