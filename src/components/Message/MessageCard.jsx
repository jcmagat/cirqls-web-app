import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";

function MessageCard({ message }) {
  return (
    <Card>
      <CardContent>
        <Typography>{message.message}</Typography>
      </CardContent>
    </Card>
  );
}

export default MessageCard;
