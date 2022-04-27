import { Card, CardContent, Typography } from "@mui/material";
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
