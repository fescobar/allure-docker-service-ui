import React, { Component } from "react";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withRouter } from "react-router-dom";

const languages = ["en", "ru", "zh", "de", "he", "br", "pl", "ja", "es", "kr"];
class AllureDockerLanguagesMenu extends Component {
  handleLanguage = (languageCode) => {
    const allureReportSettings = {
      language: languageCode,
      sidebarCollapsed: true,
      sideBySidePosition: [50, 50]
    }

    localStorage.setItem('ALLURE_REPORT_SETTINGS', JSON.stringify(allureReportSettings));
    this.props.closeLanguagesMenu()
    this.props.history.go();
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
        </Menu>
      </React.Fragment>
    );
  }
}

export default withRouter(AllureDockerLanguagesMenu);
