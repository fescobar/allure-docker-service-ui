import React from "react";

import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { Link } from "react-router-dom";

const drawerWidth = 240;

function AllureDockerProjectsSideDrawer(props) {
  const elements = [];
  for (let key in props.projects) {
    elements.push(
      <Link
        to={`/projects/${key}`}
        key={key}
        style={{ color: "inherit", textDecoration: "inherit" }}
      >
        <ListItemButton id={key} onClick={() => props.selectProject(key)}>
          <ListItemText primary={key} />
        </ListItemButton>
      </Link>
    );
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="left"
      open={props.isSideDrawerOpen}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          px: 1,
          ...theme.mixins.toolbar,
          justifyContent: "flex-end",
        })}
      >
        <IconButton onClick={props.handleSideDrawerClose}>
          {ThemeProvider.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <React.Fragment>
              <Typography
                sx={{
                  display: { xs: "block", sm: "none" },
                }}
                variant="subtitle1"
                noWrap
              >
                {props.title}
              </Typography>
              <ChevronRightIcon />
            </React.Fragment>
          )}
        </IconButton>
      </Box>
      <Divider />
      <List>{elements}</List>
    </Drawer>
  );
}

export default AllureDockerProjectsSideDrawer;
