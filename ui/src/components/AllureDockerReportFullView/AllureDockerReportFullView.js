import React, { useCallback, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import { useNavigate, useParams } from "react-router-dom";

import AllureDockerErrorPage from "../../components/AllureDockerErrorPage/AllureDockerErrorPage";
import axios from "../../api/axios-allure-docker";
import { redirect } from "../../utility/navigate";

const optionsSeconds = [
  { seconds: 10, text: "10 seconds" },
  { seconds: 20, text: "20 seconds" },
  { seconds: 30, text: "30 seconds" },
  { seconds: 40, text: "40 seconds" },
  { seconds: 50, text: "50 seconds" },
  { seconds: 60, text: "1 minute" },
  { seconds: 120, text: "2 minutes" },
  { seconds: 300, text: "5 minutes" },
  { seconds: 900, text: "15 minutes" },
  { seconds: 1800, text: "30 minutes" },
  { seconds: 2700, text: "45 minutes" },
  { seconds: 3600, text: "1 hour" },
  { seconds: 7200, text: "2 hours" },
  { seconds: 14400, text: "4 hours" },
  { seconds: 21600, text: "6 hours" },
  { seconds: 28800, text: "8 hours" },
  { seconds: 36000, text: "10 hours" },
  { seconds: 43200, text: "12 hours" },
  { seconds: 50400, text: "14 hours" },
  { seconds: 57600, text: "16 hours" },
  { seconds: 64800, text: "18 hours" },
  { seconds: 72000, text: "20 hours" },
  { seconds: 79200, text: "22 hours" },
  { seconds: 86400, text: "24 hours" },
];

function AllureDockerReportFullView() {
  const { id: projectId, reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState({ projectId: null, id: null });
  const [error, setError] = useState(null);
  const [reloadEnable, setReloadEnable] = useState(false);
  const [autoRefreshSeconds, setAutoRefreshSeconds] = useState(
    optionsSeconds[0].seconds
  );

  const getReport = useCallback(() => {
    axios
      .get(
        `/projects/${projectId}/reports/${reportId}/index.html?redirect=false`
      )
      .then(() => {
        setReport({ projectId, id: reportId });
        setError(null);
      })
      .catch((err) => {
        redirect(err);
        setReport(null);
        setError(err);
      });
  }, [projectId, reportId]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  useEffect(() => {
    if (!reloadEnable) {
      return undefined;
    }
    const intervalId = setInterval(() => {
      setReport(null);
      setError(null);
      getReport();
    }, autoRefreshSeconds * 1000);
    return () => clearInterval(intervalId);
  }, [reloadEnable, autoRefreshSeconds, getReport]);

  let content = "";
  if (report && report.projectId && report.id) {
    const reportIframe = `${window._env_.ALLURE_DOCKER_API_URL}/projects/${report.projectId}/reports/${report.id}/index.html?redirect=false`;
    content = (
      <Card>
        <div align="right">
          <IconButton color="inherit" onClick={() => navigate("/")}>
            <HomeIcon />
          </IconButton>

          {report.id === "latest" ? (
            <React.Fragment>
              Auto Refresh
              <Switch
                checked={reloadEnable}
                onChange={() => setReloadEnable((prev) => !prev)}
              />
              <Select
                native
                value={autoRefreshSeconds}
                onChange={(event) => setAutoRefreshSeconds(event.target.value)}
                disabled={!reloadEnable}
              >
                {optionsSeconds.map((option) => (
                  <option key={option.seconds} value={option.seconds}>
                    {option.text}
                  </option>
                ))}
              </Select>
            </React.Fragment>
          ) : null}
        </div>
        <CardMedia
          sx={{ height: 1000 }}
          component="iframe"
          image={reportIframe}
          title="Allure Report"
        />
      </Card>
    );
  }

  if (error) {
    content = <AllureDockerErrorPage error={error} />;
  }

  return <React.Fragment>{content}</React.Fragment>;
}

export default AllureDockerReportFullView;
