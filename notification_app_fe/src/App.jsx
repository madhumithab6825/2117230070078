import React, { useState } from "react";
import {
  ThemeProvider, createTheme, CssBaseline, Container, Box, Paper,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Button, Alert, Snackbar,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Navbar from "./components/Navbar";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import PriorityInboxPage from "./pages/PriorityInboxPage";
import RegisterPage from "./pages/RegisterPage";
import { getToken, saveToken, clearToken } from "./api/notificationService";
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
  const [hasToken, setHasToken]     = useState(() => !!getToken());
  const [activeTab, setActiveTab]   = useState("all");
  const [tokenDialog, setTokenDialog] = useState(false);
  const [tokenInput, setTokenInput] = useState(getToken());
  const [snackbar, setSnackbar]     = useState("");

  const handleSaveToken = () => {
    const t = tokenInput.trim();
    if (t) {
      saveToken(t);
      Logger.info("App", "Token saved via dialog");
      setSnackbar("Token saved! Reloading...");
      setTokenDialog(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      clearToken();
      setSnackbar("Token cleared.");
      setTokenDialog(false);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // Show registration page if no token
  if (!hasToken) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RegisterPage onRegistered={() => setHasToken(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh" bgcolor="background.default">
        <Navbar
          activeTab={activeTab}
          onTabChange={(tab) => {
            Logger.info("App", "Tab changed", tab);
            setActiveTab(tab);
          }}
          actions={
            <Tooltip title={getToken() ? "Token active — click to update" : "No token — click to add"}>
              <IconButton
                size="small"
                onClick={() => { setTokenInput(getToken()); setTokenDialog(true); }}
                sx={{ color: getToken() ? "#a5d6a7" : "#ffcc80" }}
              >
                <KeyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        />

        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 } }}>
          <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            {activeTab === "all" ? <AllNotificationsPage /> : <PriorityInboxPage />}
          </Paper>
        </Container>

        {/* Token Dialog */}
        <Dialog open={tokenDialog} onClose={() => setTokenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update Bearer Token</DialogTitle>
          <DialogContent>
            <Alert severity={getToken() ? "success" : "warning"} sx={{ mb: 2 }}>
              {getToken()
                ? "Token is active. App is using live API data."
                : "No token. App is showing demo data."}
            </Alert>
            <TextField
              fullWidth multiline rows={3} size="small"
              label="Bearer Token"
              placeholder="Paste your token here..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { clearToken(); setHasToken(false); setTokenDialog(false); }} color="error" size="small">
              Logout
            </Button>
            <Button onClick={() => setTokenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveToken} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={!!snackbar} autoHideDuration={2000} onClose={() => setSnackbar("")} message={snackbar} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
