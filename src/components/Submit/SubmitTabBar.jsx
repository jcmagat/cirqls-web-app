import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import SubmitTextPostForm from "./SubmitTextPostForm";
import SubmitMediaPostForm from "./SubmitMediaPostForm";

const TABS = {
  TEXT: "text",
  MEDIA: "media",
};

function SubmitTabBar({ communityId }) {
  const [tab, setTab] = useState("Text");

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
