import React, { Component } from "react";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withRouter } from "react-router-dom";

import axios from "../../api/axios-allure-docker";
import { redirect, refreshCurrentPageInSeconds } from "../../utility/navigate";

const languages = ["en", "ru", "zh", "de", "nl", "he", "br", "pl", "ja", "es", "kr", "fr"];
class AllureDockerLanguagesMenu extends Component {
  state = {
    languageCode: null,
  };

  handleLanguage = (languageCode) => {
    axios
      .get(`/select-language?code=${languageCode}`)
      .then((response) => {
        this.setState({ languageCode: languageCode });
        this.handleAPISuccessAlert(languageCode);
        refreshCurrentPageInSeconds(3);
      })
      .catch((error) => {
        redirect(error);
        this.handleAPIErrorAlert(error);
      });
    this.props.closeLanguagesMenu();
  };

  handleAPISuccessAlert = (languageCode) => {
    this.props.setAPIAlert(
      "info",
      `The page will be refreshed in a few seconds - Language ${languageCode.toUpperCase()} updated succesfully!`,
      true
    );
  };

  handleAPIErrorAlert = (error) => {
    this.props.setAPIAlert(
      "error",
      `Something wrong => ${error.message}`,
      true
    );
  };

  render() {
    const isOpen = Boolean(this.props.anchorEl);

    let languagesItems = [];

    for (let language of languages) {
      languagesItems.push(
        <MenuItem key={language} onClick={() => this.handleLanguage(language)}>
          <p>{language.toUpperCase()}</p>
        </MenuItem>
      );
    }

    let hiddenIframe = null;
    if (this.state.languageCode) {
      hiddenIframe = (
        <iframe
          hidden
          title="loadLanguage"
          src={`${window._env_.ALLURE_DOCKER_API_URL}/select-language?code=${this.state.languageCode}`}
        ></iframe>
      );
    }

    return (
      <React.Fragment>
        <Menu
          anchorEl={this.props.anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isOpen}
          onClose={this.props.closeLanguagesMenu}
        >
          {languagesItems}
          {hiddenIframe}
        </Menu>
      </React.Fragment>
    );
  }
}

export default withRouter(AllureDockerLanguagesMenu);
