import React from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function AllureDockerReportsDropDown(props) {
  return (
    <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 120, maxWidth: 1000 }}>
      <Select
        native
        variant="outlined"
        size="small"
        value={props.reportSelected}
        onChange={props.selectReport}
        slotProps={{
          input: {
            id: "select-multiple-native",
          },
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
}

export default AllureDockerReportsDropDown;
