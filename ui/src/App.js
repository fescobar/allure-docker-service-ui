import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { setViewerRole } from "./utility/user-actions";
import AllureDockerSigIn from "./components/AllureDockerSigIn/AllureDockerSigIn";
import AllureDockerMainContainer from "./containers/AllureDockerMainContainer/AllureDockerMainContainer";
import AllureDockerReportFullView from "./components/AllureDockerReportFullView/AllureDockerReportFullView";
import AllureDockerNotFound from "./components/AllureDockerNotFound/AllureDockerNotFound";
import AllureDockerErrorPage from "./components/AllureDockerErrorPage/AllureDockerErrorPage";
import axios from "./api/axios-allure-docker";

function App() {
  const routerBaseName = window._env_.ROUTER_BASE_NAME;
  if (
    import.meta.env.MODE !== "test" &&
    routerBaseName &&
    routerBaseName !== "/" &&
    !window.location.pathname.startsWith(routerBaseName)
  ) {
    const suffix =
      window.location.pathname === "/" ? "" : window.location.pathname;
    window.location.replace(
      `${routerBaseName}${suffix}${window.location.search}${window.location.hash}`
    );
  }

  const [darkState, setDarkState] = useState(
    () => localStorage.getItem("darkState") === "true"
  );
  const [isLogoutNeeded, setIsLogoutNeeded] = useState(false);
  const [isSignInAnOption, setIsSignInAnOption] = useState(false);
  const [isLoginRequiredState, setIsLoginRequiredState] = useState(null);
  const [error, setError] = useState(null);

  const isAdminEndpointAccessible = () => {
    return axios
      .post("/send-results")
      .then((response) => response.status !== 401)
      .catch((err) => err.status !== 401);
  };

  const isLoginRequired = useCallback(() => {
    setError(null);
    axios
      .get("/config")
      .then(async (response) => {
        const isSecurityEnabled = response.data.data.security_enabled;
        let logoutNeeded = false;
        let signInAnOption = false;
        if (isSecurityEnabled === 1) {
          logoutNeeded = true;
          const isMakeViewerEndpointsPublic =
            response.data.data.make_viewer_endpoints_public;
          if (
            isMakeViewerEndpointsPublic === 1 &&
            !(await isAdminEndpointAccessible())
          ) {
            setViewerRole();
            logoutNeeded = false;
            signInAnOption = true;
          }
        } else {
          localStorage.removeItem("expirationDate");
          localStorage.removeItem("roles");
        }
        setIsLoginRequiredState(false);
        setIsLogoutNeeded(logoutNeeded);
        setIsSignInAnOption(signInAnOption);
      })
      .catch((err) => {
        if (err.redirect) {
          setIsLoginRequiredState(true);
          setIsLogoutNeeded(false);
        }
        setError(err);
      });
  }, []);

  useEffect(() => {
    isLoginRequired();
  }, [isLoginRequired]);

  const handleThemeChange = () => {
    setDarkState((prev) => {
      const next = !prev;
      localStorage.setItem("darkState", next);
      return next;
    });
  };

  const palletType = darkState ? "dark" : "light";
  const darkTheme = createTheme({
    palette: {
      mode: palletType,
      primary: {
        main: darkState ? "#60a5fa" : "#1976d2",
        contrastText: darkState ? "#0f172a" : "#ffffff",
      },
      secondary: {
        main: darkState ? "#38bdf8" : "#0d47a1",
      },
      background: {
        default: darkState ? "#0f172a" : "#f4f6f9",
        paper: darkState ? "#1e293b" : "#ffffff",
      },
      text: {
        primary: darkState ? "#f1f5f9" : "#1e293b",
        secondary: darkState ? "#94a3b8" : "#64748b",
      },
      divider: darkState ? "rgba(148, 163, 184, 0.16)" : "rgba(15, 23, 42, 0.08)",
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily:
        '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: { fontWeight: 600, letterSpacing: "-0.02em" },
      h4: { fontWeight: 600, letterSpacing: "-0.01em" },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            ...(darkState && {
              backgroundColor: "#1e293b",
              color: "#f1f5f9",
            }),
            boxShadow: darkState
              ? "0 1px 0 rgba(148, 163, 184, 0.16)"
              : "0 2px 10px rgba(15, 23, 42, 0.12)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: darkState
              ? "1px solid rgba(148, 163, 184, 0.14)"
              : "1px solid rgba(15, 23, 42, 0.06)",
            boxShadow: darkState
              ? "0 4px 20px rgba(0, 0, 0, 0.35)"
              : "0 4px 20px rgba(15, 23, 42, 0.05)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          grouped: {
            borderColor: darkState
              ? "rgba(15, 23, 42, 0.45)"
              : "rgba(255, 255, 255, 0.35)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: darkState
              ? "rgba(148, 163, 184, 0.35)"
              : "rgba(15, 23, 42, 0.23)",
          },
        },
      },
      MuiNativeSelect: {
        styleOverrides: {
          select: {
            "& option": {
              backgroundColor: darkState ? "#1e293b" : "#ffffff",
              color: darkState ? "#f1f5f9" : "#1e293b",
            },
          },
        },
      },
    },
  });

  let switchRouter = null;
  if (error) {
    switchRouter = <AllureDockerErrorPage error={error} />;
  }

  if (isLoginRequiredState !== null) {
    if (isLoginRequiredState) {
      switchRouter = (
        <Routes>
          <Route
            path="/signin"
            element={<AllureDockerSigIn isLoginRequired={isLoginRequired} />}
          />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      );
    } else {
      const signInAnOptionRoute = isSignInAnOption ? (
        <Route
          path="/signin"
          element={
            <AllureDockerSigIn
              isLoginRequired={isLoginRequired}
              isHomeAnOption={!isSignInAnOption}
            />
          }
        />
      ) : (
        <Route path="/signin" element={<Navigate to="/" replace />} />
      );

      switchRouter = (
        <Routes>
          <Route
            path="/"
            element={
              <AllureDockerMainContainer
                darkState={darkState}
                handleThemeChange={handleThemeChange}
                isLogoutNeeded={isLogoutNeeded}
                isSignInAnOption={isSignInAnOption}
              />
            }
          />
          <Route
            path="/projects/:id"
            element={
              <AllureDockerMainContainer
                darkState={darkState}
                handleThemeChange={handleThemeChange}
                isLogoutNeeded={isLogoutNeeded}
                isSignInAnOption={isSignInAnOption}
              />
            }
          />
          <Route
            path="/projects/:id/reports/:reportId"
            element={<AllureDockerReportFullView />}
          />
          {signInAnOptionRoute}
          <Route path="*" element={<AllureDockerNotFound />} />
        </Routes>
      );
    }
  }

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter basename={window._env_.ROUTER_BASE_NAME}>
          {switchRouter}
        </BrowserRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
