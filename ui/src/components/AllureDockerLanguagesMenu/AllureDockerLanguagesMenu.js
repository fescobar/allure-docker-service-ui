import React, { useState } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import axios from "../../api/axios-allure-docker";
import { redirect, refreshCurrentPageInSeconds } from "../../utility/navigate";

const languages = ["en", "ru", "zh", "de", "nl", "he", "br", "pl", "ja", "es", "kr", "fr"];

function AllureDockerLanguagesMenu(props) {
  const [languageCode, setLanguageCode] = useState(null);

  const handleAPISuccessAlert = (code) => {
    props.setAPIAlert(
      "info",
      `The page will be refreshed in a few seconds - Language ${code.toUpperCase()} updated succesfully!`,
      true
    );
  };

  const handleAPIErrorAlert = (error) => {
    props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  const handleLanguage = (code) => {
    axios
      .get(`/select-language?code=${code}`)
      .then(() => {
        setLanguageCode(code);
        handleAPISuccessAlert(code);
        refreshCurrentPageInSeconds(3);
      })
      .catch((error) => {
        redirect(error);
        handleAPIErrorAlert(error);
      });
    props.closeLanguagesMenu();
  };

  const isOpen = Boolean(props.anchorEl);

  return (
    <React.Fragment>
      <Menu
        anchorEl={props.anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isOpen}
        onClose={props.closeLanguagesMenu}
      >
        {languages.map((language) => (
          <MenuItem key={language} onClick={() => handleLanguage(language)}>
            <p>{language.toUpperCase()}</p>
          </MenuItem>
        ))}
        {languageCode ? (
          <iframe
            hidden
            title="loadLanguage"
            src={`${window._env_.ALLURE_DOCKER_API_URL}/select-language?code=${languageCode}`}
          />
        ) : null}
      </Menu>
    </React.Fragment>
  );
}

export default AllureDockerLanguagesMenu;
