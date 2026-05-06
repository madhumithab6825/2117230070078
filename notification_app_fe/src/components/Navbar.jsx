import React from "react";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, useMediaQuery, useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";

const Navbar = ({ activeTab, onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="sticky" elevation={2} sx={{ background: "linear-gradient(90deg, #1565c0, #1976d2)" }}>
      <Toolbar sx={{ flexDirection: isMobile ? "column" : "row", py: isMobile ? 1 : 0, gap: isMobile ? 0.5 : 0 }}>
        <Box display="flex" alignItems="center" gap={1} flex={1}>
          <NotificationsIcon sx={{ color: "#fff" }} />
          <Typography variant="h6" fontWeight={700} color="#fff" noWrap>
            Campus Notifications
          </Typography>
        </Box>
        <Tabs
          value={activeTab}
          onChange={(_, v) => onTabChange(v)}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#fff" } }}
          sx={{ "& .MuiTab-root": { color: "rgba(255,255,255,0.75)", minWidth: isMobile ? 120 : 140 } }}
        >
          <Tab
            value="all"
            label="All Notifications"
            icon={<NotificationsIcon fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            value="priority"
            label="Priority Inbox"
            icon={<StarIcon fontSize="small" />}
            iconPosition="start"
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
