import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import LanguageIcon from "@mui/icons-material/Language";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";

import SwaggerLogo from "../../components/SwaggerLogo/SwaggerLogo";
import AllureDockerInfoDialog from "../../components/AllureDockerInfoDialog/AllureDockerInfoDialog";
import AllureDockerLanguagesMenu from "../../components/AllureDockerLanguagesMenu/AllureDockerLanguagesMenu";

function AllureDockerMobileMenu(props) {
  const [infoDialog, setInfoDialog] = useState(false);
  const [languagesAnchorEl, setLanguagesAnchorEl] = useState(null);

  const openInfoDialog = () => setInfoDialog(true);
  const closeInfoDialog = () => setInfoDialog(false);
  const closeLanguagesMenu = () => setLanguagesAnchorEl(null);
  const openLanguagesMenu = (event) => setLanguagesAnchorEl(event.currentTarget);

  const goToSwagger = () => {
    window.open(`${window._env_.ALLURE_DOCKER_API_URL}/swagger`, "_blank");
  };

  return (
    <React.Fragment>
      <Menu
        anchorEl={props.anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id="primary-search-account-menu-mobile"
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={props.isMobileMenuOpen}
        onClose={props.handleMobileMenuClose}
      >
        <MenuItem>
          <Switch
            checked={props.darkState}
            onChange={props.handleThemeChange}
          />
          <p>Dark Mode</p>
        </MenuItem>
        <MenuItem onClick={openLanguagesMenu}>
          <IconButton color="inherit">
            <LanguageIcon />
          </IconButton>
          <p>Language</p>
        </MenuItem>
        <MenuItem onClick={openInfoDialog}>
          <IconButton color="inherit">
            <InfoIcon />
          </IconButton>
          <p>Info</p>
        </MenuItem>
        <MenuItem onClick={goToSwagger}>
          <IconButton color="inherit">
            <SwaggerLogo height="100%" />
          </IconButton>
          <p>Swagger Doc</p>
        </MenuItem>
      </Menu>
      <AllureDockerInfoDialog
        open={infoDialog}
        handleCloseDialog={closeInfoDialog}
      />
      <AllureDockerLanguagesMenu
        closeLanguagesMenu={closeLanguagesMenu}
        anchorEl={languagesAnchorEl}
      />
    </React.Fragment>
  );
}

export default AllureDockerMobileMenu;
