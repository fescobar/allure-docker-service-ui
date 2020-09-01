import React from "react";

import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

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
          {MuiThemeProvider.direction === "ltr" ? (
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
