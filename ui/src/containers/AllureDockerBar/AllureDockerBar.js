import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import AllureDockerMobileMenu from "../../components/AllureDockerMobileMenu/AllureDockerMobileMenu";
import AllureDockerToolbar from "../../components/AllureDockerToolbar/AllureDockerToolbar";
import AllureDockerProjectsSideDrawer from "../../components/AllureDockerProjectsSideDrawer/AllureDockerProjectsSideDrawer";

const drawerWidth = 240;

function AllureDockerBar(props) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [openSideDrawer, setOpenSideDrawer] = useState(false);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: openSideDrawer
                ? theme.transitions.easing.easeOut
                : theme.transitions.easing.sharp,
              duration: openSideDrawer
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          ...(openSideDrawer && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
          }),
        }}
      >
        <AllureDockerToolbar
          title="Allure Docker Service UI"
          isSideDrawerOpen={openSideDrawer}
          handleSideDrawerOpen={() => setOpenSideDrawer(true)}
          handleSideDrawerClose={() => setOpenSideDrawer(false)}
          handleMobileMenuOpen={(event) =>
            setMobileMoreAnchorEl(event.currentTarget)
          }
          darkState={props.darkState}
          handleThemeChange={props.handleThemeChange}
          getProjects={props.getProjects}
          setAPIAlert={props.setAPIAlert}
          isLogoutNeeded={props.isLogoutNeeded}
          isSignInAnOption={props.isSignInAnOption}
        />
      </AppBar>

      <AllureDockerMobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        anchorEl={mobileMoreAnchorEl}
        darkState={props.darkState}
        handleThemeChange={props.handleThemeChange}
        handleMobileMenuClose={() => setMobileMoreAnchorEl(null)}
      />

      <AllureDockerProjectsSideDrawer
        title="Allure Docker Service UI"
        projects={props.projects}
        isSideDrawerOpen={openSideDrawer}
        handleSideDrawerClose={() => setOpenSideDrawer(false)}
        selectProject={props.selectProject}
      />

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: openSideDrawer
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
          marginLeft: openSideDrawer ? 0 : `-${drawerWidth}px`,
        })}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default AllureDockerBar;
