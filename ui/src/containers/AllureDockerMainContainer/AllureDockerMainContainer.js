import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import AllureDockerBar from "../../containers/AllureDockerBar/AllureDockerBar";
import AllureDockerProject from "../../containers/AllureDockerProject/AllureDockerProject";
import AllureDockerSnackBar from "../../components/AllureDockerSnackBar/AllureDockerSnackBar";
import AllureDockerHomePage from "../../components/AllureDockerHomePage/AllureDockerHomePage";
import { redirect } from "../../utility/navigate";

const autoHideDurationSuccessAlert = 3000;
const autoHideDurationErrorAlert = 6000;
const autoHideDurationInfoAlert = 3000;

function AllureDockerMainContainer(props) {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [, setProjectSelected] = useState(null);
  const [apiAlert, setApiAlert] = useState({
    severity: "info",
    show: false,
    message: "",
    duration: 0,
  });

  const setAPIAlert = (severity, message, show) => {
    let duration = 0;
    if (severity === "success") {
      duration = autoHideDurationSuccessAlert;
    } else if (severity === "error") {
      duration = autoHideDurationErrorAlert;
    } else if (severity === "info") {
      duration = autoHideDurationInfoAlert;
    }
    setApiAlert({ severity, show, message, duration });
  };

  const resetAPIAlert = () => {
    setApiAlert((prev) => ({
      ...prev,
      show: false,
      message: "",
      duration: 0,
    }));
  };

  const getProjects = () => {
    axios
      .get("/projects")
      .then((response) => {
        const fetchedProjects = response.data.data.projects;
        setProjects(fetchedProjects);
        setProjectSelected(
          fetchedProjects && fetchedProjects.length !== 0
            ? Object.keys(fetchedProjects)[0]
            : null
        );
      })
      .catch((error) => {
        redirect(error);
        setAPIAlert("error", error.message, true);
      });
  };

  useEffect(() => {
    getProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = id ? (
    <AllureDockerProject setAPIAlert={setAPIAlert} getProjects={getProjects} />
  ) : (
    <AllureDockerHomePage />
  );

  return (
    <AllureDockerBar
      projects={projects || []}
      getProjects={getProjects}
      darkState={props.darkState}
      handleThemeChange={props.handleThemeChange}
      selectProject={setProjectSelected}
      setAPIAlert={setAPIAlert}
      isLogoutNeeded={props.isLogoutNeeded}
      isSignInAnOption={props.isSignInAnOption}
    >
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          p: 5,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        <AllureDockerSnackBar
          severity={apiAlert.severity}
          show={apiAlert.show}
          message={apiAlert.message}
          duration={apiAlert.duration}
          resetAPIAlert={resetAPIAlert}
        />
        {content}
      </Box>
    </AllureDockerBar>
  );
}

export default AllureDockerMainContainer;
