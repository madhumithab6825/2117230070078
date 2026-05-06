import React, { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Paper } from "@mui/material";
import Navbar from "./components/Navbar";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import PriorityInboxPage from "./pages/PriorityInboxPage";
import Logger from "./utils/logger";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f0f4f8" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
  shape: { borderRadius: 8 },
});

const App = () => {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (tab) => {
    Logger.info("App", "Tab changed", tab);
    setActiveTab(tab);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh" bgcolor="background.default">
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 } }}>
          <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            {activeTab === "all" ? <AllNotificationsPage /> : <PriorityInboxPage />}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
