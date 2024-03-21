import React from "react";
import { withStyles } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 1000,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
});

const allureDockerReportsDropDown = (props) => {
  const { classes } = props;
  return (
    <FormControl className={classes.formControl}>
      <Select
        native
        value={props.reportSelected}
        onChange={props.selectReport}
        inputProps={{
          id: "select-multiple-native",
        }}
      >
        {props.reports.map((report) => (
          <option key={report.linkValue} value={report.linkValue}>
            {report.linkVisibleText}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
export default withStyles(styles, { withTheme: true })(
  allureDockerReportsDropDown
);
