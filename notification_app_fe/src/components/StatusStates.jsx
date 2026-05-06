import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

export const ErrorState = ({ message, onRetry }) => (
  <Box display="flex" flexDirection="column" alignItems="center" py={6} gap={2}>
    <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
    <Typography color="error" variant="body1" textAlign="center">{message}</Typography>
    {onRetry && (
      <Button variant="outlined" color="error" size="small" onClick={onRetry}>
        Retry
      </Button>
    )}
  </Box>
);

export const EmptyState = ({ message = "No notifications found." }) => (
  <Box display="flex" flexDirection="column" alignItems="center" py={6} gap={2}>
    <NotificationsOffIcon sx={{ fontSize: 48, color: "text.disabled" }} />
    <Typography color="text.secondary" variant="body2">{message}</Typography>
  </Box>
);
