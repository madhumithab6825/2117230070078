import React, { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button, Alert,
  CircularProgress, Divider, Chip,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import KeyIcon from "@mui/icons-material/Key";
import { saveToken } from "../api/notificationService";
import Logger from "../utils/logger";

const CTX = "RegisterPage";

const FIELDS = [
  { key: "name",           label: "Full Name",       type: "text"  },
  { key: "email",          label: "College Email",   type: "email" },
  { key: "mobileNo",       label: "Mobile Number",   type: "tel"   },
  { key: "rollNo",         label: "Roll Number",     type: "text"  },
  { key: "githubUsername", label: "GitHub Username", type: "text"  },
  { key: "accessCode",     label: "Access Code",     type: "text"  },
];

const RegisterPage = ({ onRegistered }) => {
  const [form, setForm] = useState({
    name: "Madhumitha B",
    email: "madhumitha.b.2023.aids@ritchennai.edu.in",
    mobileNo: "6379830126",
    rollNo: "2117230070078",
    githubUsername: "madhumithab6825",
    accessCode: "BTCDqT",
  });
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [showTokenBox, setShowTokenBox] = useState(false);
  const [token, setToken]           = useState("");
  const [tokenError, setTokenError] = useState("");

  const handleChange = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setError("");
  };

  const handleSubmit = async () => {
    for (const { key, label } of FIELDS) {
      if (!form[key].trim()) { setError(`${label} is required.`); return; }
    }
    setLoading(true);
    setError("");
    Logger.info(CTX, "Submitting registration", form.email);

    try {
      const res = await fetch("http://20.207.122.201/evaluation-service/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      Logger.info(CTX, "Registration response", data);

      const receivedToken = data.token || data.accessToken || data.access_token;

      if (receivedToken) {
        saveToken(receivedToken);
        Logger.info(CTX, "Token received and saved");
        onRegistered();
      } else {
        // Already registered or any other case — show token paste box
        setShowTokenBox(true);
        setError("");
      }
    } catch (err) {
      Logger.error(CTX, "Registration error", err.message);
      // Network error — still show token paste box as fallback
      setShowTokenBox(true);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = () => {
    const t = token.trim();
    if (!t) { setTokenError("Please paste your token."); return; }
    saveToken(t);
    Logger.info(CTX, "Token manually saved");
    onRegistered();
  };

  const handleSkip = () => {
    Logger.warn(CTX, "Skipped token — using demo data");
    onRegistered();
  };

  return (
    <Box minHeight="100vh" bgcolor="#f0f4f8" display="flex" alignItems="center" justifyContent="center" p={2}>
      <Paper elevation={3} sx={{ maxWidth: 460, width: "100%", p: 4, borderRadius: 3 }}>

        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <HowToRegIcon color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={700}>Campus Notifications</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Register to access live campus notifications.
        </Typography>

        {!showTokenBox ? (
          <>
            <Chip label="Step 1 — Register" color="primary" size="small" sx={{ mb: 2, fontWeight: 600 }} />

            {FIELDS.map(({ key, label, type }) => (
              <TextField
                key={key}
                label={label}
                type={type}
                size="small"
                fullWidth
                sx={{ mb: 1.5 }}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                disabled={loading}
              />
            ))}

            {error && <Alert severity="error" sx={{ mb: 1.5, py: 0.5 }}>{error}</Alert>}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Register & Get Token"}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="text"
              fullWidth
              size="small"
              onClick={() => setShowTokenBox(true)}
              startIcon={<KeyIcon />}
            >
              Already have a token? Paste it here
            </Button>
          </>
        ) : (
          <>
            <Chip label="Step 2 — Paste Your Token" color="success" size="small" sx={{ mb: 2, fontWeight: 600 }} />

            <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
              Your account is registered. The token was sent to your college email —
              <strong> madhumitha.b.2023.aids@ritchennai.edu.in</strong>. Check your inbox and paste it below.
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              label="Paste Bearer Token"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={token}
              onChange={(e) => { setToken(e.target.value); setTokenError(""); }}
              sx={{ mb: 1.5 }}
              autoFocus
            />

            {tokenError && <Alert severity="error" sx={{ mb: 1.5, py: 0.5 }}>{tokenError}</Alert>}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSaveToken}
              disabled={!token.trim()}
              sx={{ mb: 1.5 }}
            >
              Save Token &amp; Open App
            </Button>

            <Button
              variant="outlined"
              fullWidth
              size="small"
              color="warning"
              onClick={handleSkip}
            >
              Skip — Continue with Demo Data
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default RegisterPage;
