"use client";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import { useState } from "react";

import Step1 from "./steps/step1";
import Step2 from "./steps/step2";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface ITrack {
  fileName: string;
  percent: number;
  urlFileTrack: "";
}

function UploadTrack() {
  const [value, setValue] = useState(0);

  const [trackUpload, setTrackUpload] = useState<ITrack>({
    fileName: "",
    percent: 0,
    urlFileTrack: "",
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // console.log("check trackUpload", trackUpload);

  return (
    <Box sx={{ width: "100%", marginTop: "40px", border: "0.2px solid #ccc" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Track" {...a11yProps(0)} disabled={value !== 0} />
          <Tab
            label="Basic Information"
            {...a11yProps(1)}
            disabled={value !== 1}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Step1
          setValue={setValue}
          setTrackUpload={setTrackUpload}
          trackUpload={trackUpload}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Step2 trackUpload={trackUpload} setValue={setValue}/>
      </CustomTabPanel>
    </Box>
  );
}

export default UploadTrack;
