import axios from "axios";
import * as errors from "../api/errors/errors";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const refreshInstance = axios.create({
  baseURL: window._env_.ALLURE_DOCKER_API_URL,
});

refreshInstance.interceptors.request.use(
  function (config) {
    config.withCredentials = true;

    const csrf = cookies.get("csrf_refresh_token");
    if (csrf) {
      config.headers["X-CSRF-TOKEN"] = csrf;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const instance = axios.create({
  baseURL: window._env_.ALLURE_DOCKER_API_URL,
});

instance.interceptors.request.use(
  function (config) {
    config.withCredentials = true;
    if (!config.headers["X-CSRF-TOKEN"]) {
      const csrf = cookies.get("csrf_access_token");
      if (csrf) {
        config.headers["X-CSRF-TOKEN"] = csrf;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.request.use(async (request) => {
  if (localStorage.getItem("expirationDate")) {
    const expirationDate = new Date(localStorage.getItem("expirationDate"));
    if (expirationDate <= new Date()) {
      console.log("REFRESHING!!!!");
      await refreshInstance
        .post("/refresh")
        .then((response) => {
          const expiresIn = response.data.data.expires_in;
          if (expiresIn !== 0) {
            const expirationDate = new Date(
              new Date().getTime() + expiresIn * 1000
            );
            localStorage.setItem("expirationDate", expirationDate);
          }
        })
        .catch((error) => {
          localStorage.removeItem("expirationDate");
        });
    }
  }

  return request;
});

instance.interceptors.response.use((response) => {
  //TODO response.headers['Set-Cookie'] = "SameSite=None"
  return response;
});

instance.interceptors.response.use(undefined, (error) => {
  let message = "";
  let stackTrace = "";
  let type = "";
  let status = "";
  let redirect = false;

  try {
    if (error.response && error.response.status) {
      status = error.response.status;
    }
    message = error.response.data["meta_data"].message;
    type = errors.SPECIFIC_ERROR;
  } catch (ex) {
    message = JSON.stringify(error.message);
    stackTrace = JSON.stringify(error);
    type = errors.GENERIC_ERROR;
  }

  if (status === 401) {
    redirect = true;
  }
  return Promise.reject({ message, stackTrace, type, status, redirect });
});

export default instance;
