import React from "react";
import {
  Card, CardContent, Typography, Chip, Box, Tooltip, IconButton,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import EmailIcon from "@mui/icons-material/Email";
import { TYPE_COLOR, TYPE_BG } from "../utils/priorityUtils";

const formatTime = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  return isNaN(d) ? ts : d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const NotificationCard = ({ notification, isViewed, onView }) => {
  const { ID, Type, Message, Timestamp } = notification;
  const bg = isViewed ? "#fafafa" : TYPE_BG[Type] ?? "#fff";
  const border = isViewed ? "1px solid #e0e0e0" : `2px solid`;
  const borderColor = isViewed ? undefined : { Placement: "#66bb6a", Result: "#ffa726", Event: "#42a5f5" }[Type];

  return (
    <Card
      elevation={isViewed ? 0 : 2}
      sx={{
        mb: 1.5,
        background: bg,
        border,
        borderColor,
        borderRadius: 2,
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
        opacity: isViewed ? 0.75 : 1,
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Box flex={1} minWidth={0}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
              <Chip
                label={Type}
                color={TYPE_COLOR[Type] ?? "default"}
                size="small"
                sx={{ fontWeight: 600, fontSize: "0.7rem" }}
              />
              {!isViewed && (
                <Chip label="New" size="small" color="error" variant="outlined"
                  sx={{ fontSize: "0.65rem", height: 18 }} />
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: isViewed ? 400 : 600, color: "text.primary", wordBreak: "break-word" }}
            >
              {Message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {formatTime(Timestamp)}
            </Typography>
          </Box>
          <Tooltip title={isViewed ? "Already viewed" : "Mark as viewed"}>
            <span>
              <IconButton
                size="small"
                onClick={() => !isViewed && onView(ID)}
                disabled={isViewed}
                sx={{ color: isViewed ? "text.disabled" : "primary.main", mt: 0.5 }}
              >
                {isViewed ? <MarkEmailReadIcon fontSize="small" /> : <EmailIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
