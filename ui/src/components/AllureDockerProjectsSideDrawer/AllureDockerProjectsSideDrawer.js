import React from "react";

import { withStyles, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { Link, withRouter } from "react-router-dom";

const drawerWidth = 240;
const styles = (theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  title: {
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
});

const allureDockerProjectsSideDrawer = (props) => {
  const { classes } = props;

  const elements = [];
  for (let key in props.projects) {
    elements.push(
      <Link
        to={`/projects/${key}`}
        key={key}
        style={{ color: "inherit", textDecoration: "inherit" }}
      >
        <ListItem button id={key} onClick={() => props.selectProject(key)}>
          <ListItemText primary={key} />
        </ListItem>
      </Link>
    );
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={props.isSideDrawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={props.handleSideDrawerClose}>
          {useTheme().direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <React.Fragment>
              <Typography className={classes.title} variant="subtitle1" noWrap>
                {props.title}
              </Typography>
              <ChevronRightIcon />
            </React.Fragment>
          )}
        </IconButton>
      </div>
      <Divider />
      <List>{elements}</List>
    </Drawer>
  );
};

export default withStyles(styles, { withTheme: true })(
  withRouter(allureDockerProjectsSideDrawer)
);
