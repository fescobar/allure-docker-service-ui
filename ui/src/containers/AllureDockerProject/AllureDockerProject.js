import React, { useCallback, useEffect, useState } from "react";

import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FileCopyRounded from "@mui/icons-material/FileCopyRounded";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Refresh from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import AllureDockerReportsDropDown from "../../components/AllureDockerReportsDropDown/AllureDockerReportsDropDown";
import AllureDockerDeleteProjectDialog from "../../components/AllureDockerDeleteProjectDialog/AllureDockerDeleteProjectDialog";
import AllureDockerGenerateReport from "../../components/AllureDockerGenerateReportDialog/AllureDockerGenerateReportDialog";
import AllureDockerCleanResultsDialog from "../../components/AllureDockerCleanResultsDialog/AllureDockerCleanResultsDialog";
import AllureDockerCleanHistoryDialog from "../../components/AllureDockerCleanHistoryDialog/AllureDockerCleanHistoryDialog";
import AllureDockerSendResultsDialog from "../../components/AllureDockerSendResultsDialog/AllureDockerSendResultsDialog";
import { redirect, redirectRootInSeconds } from "../../utility/navigate";
import { isAdmin } from "../../utility/user-actions";

function AllureDockerProject(props) {
  const { setAPIAlert, getProjects } = props;
  const { id: routeProjectId } = useParams();

  const [project, setProject] = useState(null);
  const [projectNotFound, setProjectNotFound] = useState(false);
  const [progress, setProgress] = useState(false);
  const [reportSelected, setReportSelected] = useState(null);
  const [reportSelectedValue, setReportSelectedValue] = useState(0);
  const [reportUrlSelected, setReportUrlSelected] = useState(null);
  const [openDeleteProjectDialog, setOpenDeleteProjectDialog] = useState(false);
  const [openGenerateReportDialog, setOpenGenerateReportDialog] =
    useState(false);
  const [openCleanResultsDialog, setOpenCleanResultsDialog] = useState(false);
  const [openCleanHistoryDialog, setOpenCleanHistoryDialog] = useState(false);
  const [openSendResultsDialog, setOpenSendResultsDialog] = useState(false);
  const [openCopyToolTip, setOpenCopyToolTip] = useState(false);

  const handleAPISuccessAlert = useCallback(
    (message) => {
      setAPIAlert("success", message, true);
    },
    [setAPIAlert]
  );

  const handleAPIErrorAlert = useCallback(
    (error) => {
      setAPIAlert("error", `Something wrong => ${error.message}`, true);
    },
    [setAPIAlert]
  );

  const getProject = useCallback(
    (targetProjectId) => {
      axios
        .get(`/projects/${targetProjectId}`)
        .then((response) => {
          setProject(response.data.data.project);
          setReportSelected(null);
          setReportSelectedValue(0);
          setReportUrlSelected(null);
          setProjectNotFound(false);
        })
        .catch((error) => {
          redirect(error);
          setProjectNotFound(error.status === 404);
          handleAPIErrorAlert(error);
          setProject((prev) => ({
            ...(prev || {}),
            id: targetProjectId,
            reports: [],
          }));
          redirectRootInSeconds(3);
        });
    },
    [handleAPIErrorAlert]
  );

  useEffect(() => {
    if (routeProjectId) {
      getProject(routeProjectId);
    }
  }, [routeProjectId, getProject]);

  const refreshProject = () => {
    setProject(null);
    setProjectNotFound(false);
    setProgress(false);
    setReportSelected(null);
    setReportSelectedValue(0);
    setReportUrlSelected(null);
    if (routeProjectId) {
      getProject(routeProjectId);
    }
  };

  const goToEmailableReport = (targetProjectId) => {
    if (targetProjectId) {
      axios
        .get(`/emailable-report/render?project_id=${targetProjectId}`, {
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "text/html" })
          );
          window.open(url, "_blank");
          handleAPISuccessAlert("Report successfully rendered");
        })
        .catch((error) => {
          redirect(error);
          handleAPIErrorAlert(error);
        });
    }
  };

  const exportEmailableReport = (targetProjectId) => {
    axios
      .get(`/emailable-report/export?project_id=${targetProjectId}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "text/html" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = `${targetProjectId}-emailable-report-allure-docker-service.html`;
        link.click();
        handleAPISuccessAlert("Emailable Report successfully exported");
      })
      .catch((error) => {
        redirect(error);
        handleAPIErrorAlert(error);
      });
  };

  const exportFullReport = (targetProjectId) => {
    axios
      .get(`/report/export?project_id=${targetProjectId}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/zip" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = `${targetProjectId}-allure-docker-service-report.zip`;
        link.click();
        handleAPISuccessAlert("Full Report successfully exported");
      })
      .catch((error) => {
        redirect(error);
        handleAPIErrorAlert(error);
      });
  };

  const copyReportUrl = (url) => {
    if (url) {
      navigator.clipboard.writeText(url);
      setOpenCopyToolTip(true);
    }
  };

  const goToReport = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const buildReportIPath = (targetProjectId, reportId) => {
    return `/projects/${targetProjectId}/reports/${reportId}/index.html?redirect=false`;
  };

  const selectReport = (event, targetProjectId) => {
    const selectedUrlText =
      event.target["options"][event.target["options"].selectedIndex].text;
    const selectedValue = event.target.value;
    const reportPath = buildReportIPath(targetProjectId, selectedValue);

    axios
      .get(reportPath)
      .then(() => {
        setReportSelectedValue(selectedValue);
        setReportSelected(`${window._env_.ALLURE_DOCKER_API_URL}${reportPath}`);
        setReportUrlSelected(selectedUrlText);
      })
      .catch((error) => {
        redirect(error);
        handleAPIErrorAlert(error);
      });
  };

  let projectId = "";
  const reports = [];
  let reportIframe = "";
  let currentReportSelectedValue = "";
  let currentReportUrlSelected = "";

  if (project) {
    projectId = project.id;
    if (project.reports.length !== 0) {
      for (let i in project.reports) {
        reports.push({
          linkValue: project.reports_id[i],
          linkVisibleText: `${window.location.href}/reports/${project.reports_id[i]}`,
        });
      }
      const reportPath = buildReportIPath(projectId, reports[0].linkValue);
      reportIframe = `${window._env_.ALLURE_DOCKER_API_URL}${reportPath}`;
      currentReportSelectedValue = reports[0].linkValue;
      currentReportUrlSelected = reports[0].linkVisibleText;

      if (reportSelected && reportSelected !== reportIframe) {
        reportIframe = reportSelected;
        currentReportSelectedValue = reportSelectedValue;
      }

      if (reportUrlSelected) {
        currentReportUrlSelected = reportUrlSelected;
      }
    }
  }

  const buttons = [];
  if (!projectNotFound) {
    buttons.push(
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpenDeleteProjectDialog(true)}
        key="delete"
        disabled={!isAdmin()}
      >
        Delete Project
      </Button>
    );
  }

  if (
    !currentReportSelectedValue ||
    currentReportSelectedValue === "latest" ||
    reports.length === 0
  ) {
    buttons.push(
      <Button
        key="send-results"
        onClick={() => setOpenSendResultsDialog(true)}
        disabled={!isAdmin()}
      >
        Send Results
      </Button>
    );
    buttons.push(
      <Button
        key="generate-report"
        onClick={() => setOpenGenerateReportDialog(true)}
        disabled={!isAdmin()}
      >
        Generate Report
      </Button>
    );
    buttons.push(
      <Button
        key="clean-results"
        onClick={() => setOpenCleanResultsDialog(true)}
        disabled={!isAdmin()}
      >
        Clean Results
      </Button>
    );
    buttons.push(
      <Button
        key="clean-history"
        onClick={() => setOpenCleanHistoryDialog(true)}
        disabled={!isAdmin()}
      >
        Clean History
      </Button>
    );
    buttons.push(
      <Button
        key="get-emailable-report"
        onClick={() => goToEmailableReport(projectId)}
      >
        Get Emailable Report
      </Button>
    );
    buttons.push(
      <Button
        key="export-emailable-report"
        onClick={() => exportEmailableReport(projectId)}
      >
        Export Emailable Report
      </Button>
    );
    buttons.push(
      <Button
        key="export-full-report"
        onClick={() => exportFullReport(projectId)}
      >
        Export Full Report
      </Button>
    );
  }

  return (
    <React.Fragment>
      <Grid container spacing={8}>
        <Grid size={12}>
          <Paper
            sx={{
              pt: 2,
              px: 3,
              pb: 0,
              display: "flex",
              overflow: "auto",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" align="left">
              {projectId}
            </Typography>
            <div align="center">
              {progress ? (
                <Backdrop
                  open={true}
                  sx={(theme) => ({
                    zIndex: theme.zIndex.drawer + 1,
                    color: "#fff",
                  })}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : null}
            </div>
            <div>
              <AllureDockerReportsDropDown
                selectReport={(event) => selectReport(event, projectId)}
                reportSelected={currentReportSelectedValue}
                reports={reports}
              />
              <Button key="refresh" onClick={refreshProject}>
                <Refresh />
              </Button>

              <ClickAwayListener onClickAway={() => setOpenCopyToolTip(false)}>
                <Tooltip
                  slotProps={{
                    popper: {
                      disablePortal: true,
                    },
                  }}
                  onClose={() => setOpenCopyToolTip(false)}
                  open={openCopyToolTip}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title="URL copied"
                  placement="top"
                >
                  <Button
                    key="file-copy"
                    onClick={() => copyReportUrl(currentReportUrlSelected)}
                  >
                    <FileCopyRounded />
                  </Button>
                </Tooltip>
              </ClickAwayListener>
              <Button
                key="go-to"
                onClick={() => goToReport(currentReportUrlSelected)}
              >
                <FullscreenIcon />
              </Button>
            </div>
            <div>
              <ButtonGroup
                size="large"
                color="primary"
                variant="contained"
                aria-label="outlined primary button group"
                sx={{ my: 2 }}
              >
                {buttons}
              </ButtonGroup>
              <AllureDockerDeleteProjectDialog
                projectId={routeProjectId}
                open={openDeleteProjectDialog}
                handleCloseDialog={() => setOpenDeleteProjectDialog(false)}
                setAPIAlert={setAPIAlert}
                getProjects={getProjects}
                showProgress={setProgress}
              />
              <AllureDockerSendResultsDialog
                projectId={routeProjectId}
                open={openSendResultsDialog}
                handleCloseDialog={() => setOpenSendResultsDialog(false)}
                setAPIAlert={setAPIAlert}
                getProjects={getProjects}
                refreshProject={refreshProject}
                showProgress={setProgress}
              />
              <AllureDockerGenerateReport
                projectId={routeProjectId}
                open={openGenerateReportDialog}
                handleCloseDialog={() => setOpenGenerateReportDialog(false)}
                setAPIAlert={setAPIAlert}
                getProjects={getProjects}
                refreshProject={refreshProject}
                showProgress={setProgress}
              />
              <AllureDockerCleanResultsDialog
                projectId={routeProjectId}
                open={openCleanResultsDialog}
                handleCloseDialog={() => setOpenCleanResultsDialog(false)}
                setAPIAlert={setAPIAlert}
                getProjects={getProjects}
                refreshProject={refreshProject}
                showProgress={setProgress}
              />
              <AllureDockerCleanHistoryDialog
                projectId={routeProjectId}
                open={openCleanHistoryDialog}
                handleCloseDialog={() => setOpenCleanHistoryDialog(false)}
                setAPIAlert={setAPIAlert}
                getProjects={getProjects}
                refreshProject={refreshProject}
                showProgress={setProgress}
              />
              <Card>
                <CardMedia
                  sx={{ height: 1000 }}
                  component="iframe"
                  image={reportIframe}
                  title="Allure Report"
                />
              </Card>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AllureDockerProject;
