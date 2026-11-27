import React, { useState } from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
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
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../utility/user-actions";

import SwaggerLogo from "../../components/SwaggerLogo/SwaggerLogo";

import AllureDockerNewProjectDialog from "../AllureDockerNewProjectDialog/AllureDockerNewProjectDialog";
import AllureDockerConfigDialog from "../AllureDockerConfigDialog/AllureDockerConfigDialog";
import AllureDockerInfoDialog from "../AllureDockerInfoDialog/AllureDockerInfoDialog";
import AllureDockerLanguagesMenu from "../AllureDockerLanguagesMenu/AllureDockerLanguagesMenu";
import AllureDockerSignOutDialog from "../AllureDockerSignOutDialog/AllureDockerSignOutDialog";
import { redirect, redirectRoot } from "../../utility/navigate";
import axios from "../../api/axios-allure-docker";

function AllureDockerToolbar(props) {
  const navigate = useNavigate();
  const [newProjectDialog, setNewProjectDialog] = useState(false);
  const [configDialog, setConfigDialog] = useState(false);
  const [signOutDialog, setSignOutDialog] = useState(false);
  const [infoDialog, setInfoDialog] = useState(false);
  const [languagesAnchorEl, setLanguagesAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const goToSwagger = () => {
    window.open(`${window._env_.ALLURE_DOCKER_API_URL}/swagger`, "_blank");
  };

  const handleAPIErrorAlert = (error) => {
    props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  const handleSearch = (event, id) => {
    axios
      .get(`/projects/search?id=${id}`)
      .then((response) => {
        const projects = response.data.data.projects;
        setSearchResults(Object.keys(projects));
      })
      .catch((error) => {
        redirect(error);
        if (error.status !== 404) {
          handleAPIErrorAlert(error);
        }
        setSearchResults([]);
      });
  };

  const handleSearchValue = (event, value) => {
    if (value) {
      navigate(`/projects/${value}`);
    }
  };

  return (
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={props.handleSideDrawerOpen}
        edge="start"
        sx={{
          mr: 2,
          ...(props.isSideDrawerOpen && { display: "none" }),
        }}
      >
        <MenuIcon />
      </IconButton>

      <Typography
        sx={{ display: { xs: "none", sm: "block" } }}
        variant="h6"
        noWrap
      >
        {props.title}
      </Typography>

      <Box
        sx={(theme) => ({
          position: "relative",
          borderRadius: `${theme.shape.borderRadius}px`,
          backgroundColor: alpha(theme.palette.common.white, 0.15),
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
          },
          mr: 2,
          ml: { xs: 0, sm: 3 },
          width: { xs: "100%", sm: "auto" },
        })}
      >
        <Box
          sx={{
            px: 2,
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SearchIcon />
        </Box>
        <Autocomplete
          sx={(theme) => ({
            color: "inherit",
            p: 0.5,
            pl: `calc(1em + ${theme.spacing(5)})`,
            transition: theme.transitions.create("width"),
            width: { xs: "100%", md: "40ch" },
          })}
          options={searchResults}
          onInputChange={handleSearch}
          onChange={handleSearchValue}
          noOptionsText={"project not found"}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Project ID..."
              margin="none"
              variant="standard"
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  disableUnderline: true,
                },
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <IconButton color="inherit" onClick={redirectRoot}>
        <HomeIcon />
      </IconButton>

      {props.isSignInAnOption ? (
        <IconButton color="inherit" onClick={() => navigate("/signin")}>
          <AccountCircle />
        </IconButton>
      ) : null}

      <IconButton
        color="inherit"
        onClick={() => setNewProjectDialog(true)}
        disabled={!isAdmin()}
      >
        <AddCircle />
      </IconButton>

      <IconButton color="inherit" onClick={() => setConfigDialog(true)}>
        <SettingsIcon />
      </IconButton>

      {props.isLogoutNeeded ? (
        <IconButton color="inherit" onClick={() => setSignOutDialog(true)}>
          <ExitToAppIcon />
        </IconButton>
      ) : null}
      <Divider orientation="vertical" flexItem />

      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <IconButton color="inherit">
          <Switch
            checked={props.darkState}
            onChange={props.handleThemeChange}
            sx={{
              "& .MuiSwitch-thumb": {
                backgroundColor: props.darkState ? "#38bdf8" : "#ffffff",
              },
              "& .MuiSwitch-track": {
                backgroundColor: props.darkState
                  ? "rgba(56, 189, 248, 0.45)"
                  : "rgba(255, 255, 255, 0.45)",
                opacity: 1,
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: props.darkState
                  ? "rgba(56, 189, 248, 0.55)"
                  : "rgba(255, 255, 255, 0.55)",
                opacity: 1,
              },
            }}
          />
        </IconButton>

        <IconButton
          color="inherit"
          onClick={(event) => setLanguagesAnchorEl(event.currentTarget)}
        >
          <LanguageIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem />

        <IconButton color="inherit" onClick={() => setInfoDialog(true)}>
          <InfoIcon />
        </IconButton>

        <IconButton color="inherit" onClick={goToSwagger}>
          <SwaggerLogo height="100%" />
        </IconButton>
      </Box>

      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton
          aria-label="show more"
          aria-controls="primary-search-account-menu-mobile"
          aria-haspopup="true"
          onClick={props.handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
        <AllureDockerNewProjectDialog
          setAPIAlert={props.setAPIAlert}
          open={newProjectDialog}
          closeNewProjectDialog={() => setNewProjectDialog(false)}
          getProjects={props.getProjects}
        />
        <AllureDockerConfigDialog
          setAPIAlert={props.setAPIAlert}
          open={configDialog}
          closeConfigDialog={() => setConfigDialog(false)}
        />
        <AllureDockerSignOutDialog
          setAPIAlert={props.setAPIAlert}
          open={signOutDialog}
          closeSignOutDialog={() => setSignOutDialog(false)}
        />
        <AllureDockerInfoDialog
          open={infoDialog}
          handleCloseDialog={() => setInfoDialog(false)}
        />
        <AllureDockerLanguagesMenu
          setAPIAlert={props.setAPIAlert}
          closeLanguagesMenu={() => setLanguagesAnchorEl(null)}
          anchorEl={languagesAnchorEl}
        />
      </Box>
    </Toolbar>
  );
}

export default AllureDockerToolbar;
