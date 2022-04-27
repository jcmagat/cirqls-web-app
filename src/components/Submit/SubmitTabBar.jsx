import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SubmitTextPostForm from "./SubmitTextPostForm";
import SubmitMediaPostForm from "./SubmitMediaPostForm";

const TABS = {
  TEXT: "text",
  MEDIA: "media",
};

function SubmitTabBar({ communityId }) {
  const [tab, setTab] = useState(TABS.TEXT);

  return (
    <Paper elevation={0}>
      <TabContext value={tab}>
        <TabList
          indicatorColor="primary"
          onChange={(event, value) => setTab(value)}
        >
          <Tab label="Text" value={TABS.TEXT} />
          <Tab label="Media" value={TABS.MEDIA} />
        </TabList>

        <TabPanel value={TABS.TEXT}>
          <SubmitTextPostForm communityId={communityId} />
        </TabPanel>

        <TabPanel value={TABS.MEDIA}>
          <SubmitMediaPostForm communityId={communityId} />
        </TabPanel>
      </TabContext>
    </Paper>
  );
}

export default SubmitTabBar;
