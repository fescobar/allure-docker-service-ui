import React, { Component } from "react";

import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import LanguageIcon from "@material-ui/icons/Language";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import { withRouter } from "react-router-dom";

import SwaggerLogo from "../../components/SwaggerLogo/SwaggerLogo";
import AllureDockerInfoDialog from "../../components/AllureDockerInfoDialog/AllureDockerInfoDialog";
import AllureDockerLanguagesMenu from "../../components/AllureDockerLanguagesMenu/AllureDockerLanguagesMenu";

class AllureDockerMobileMenu extends Component {
  state = {
    infoDialog: false,
    languagesAnchorEl: null,
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

  render() {
    return (
      <React.Fragment>
        <Menu
          anchorEl={this.props.anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          id="primary-search-account-menu-mobile"
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.props.isMobileMenuOpen}
          onClose={this.props.handleMobileMenuClose}
        >
          <MenuItem>
            <Switch
              checked={this.props.darkState}
              onChange={this.props.handleThemeChange}
            />
            <p>Dark Mode</p>
          </MenuItem>
          <MenuItem onClick={this.openLanguagesMenu}>
            <IconButton color="inherit">
              <LanguageIcon />
            </IconButton>
            <p>Language</p>
          </MenuItem>
          <MenuItem onClick={this.openInfoDialog}>
            <IconButton color="inherit">
              <InfoIcon />
            </IconButton>
            <p>Info</p>
          </MenuItem>
          <MenuItem onClick={this.goToSwagger}>
            <IconButton color="inherit">
              <SwaggerLogo height="100%" />
            </IconButton>
            <p>Swagger Doc</p>
          </MenuItem>
        </Menu>
        <AllureDockerInfoDialog
          open={this.state.infoDialog}
          handleCloseDialog={this.closeInfoDialog}
        />
        <AllureDockerLanguagesMenu
          closeLanguagesMenu={this.closeLanguagesMenu}
          anchorEl={this.state.languagesAnchorEl}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(AllureDockerMobileMenu);
