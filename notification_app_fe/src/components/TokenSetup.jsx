import React, { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button, Alert,
  Accordion, AccordionSummary, AccordionDetails, Chip,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { saveToken } from "../api/notificationService";
import Logger from "../utils/logger";

const CTX = "TokenSetup";

const CURL_CMD = `curl -X POST "http://20.207.122.201/evaluation-service/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "yourroll@college.edu",
    "name": "Your Name",
    "mobileNo": "9999999999",
    "githubUsername": "your-github-username",
    "rollNo": "YOUR_ROLL_NUMBER",
    "accessCode": "YOUR_ACCESS_CODE"
  }'`;

const TokenSetup = ({ onTokenSaved }) => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    const trimmed = token.trim();
    if (!trimmed) {
      setError("Token cannot be empty.");
      return;
    }
    saveToken(trimmed);
    Logger.info(CTX, "Bearer token saved");
    onTokenSaved();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CURL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box
      minHeight="100vh"
      bgcolor="#f0f4f8"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <Paper elevation={3} sx={{ maxWidth: 520, width: "100%", p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <LockOpenIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Campus Notifications
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          The notifications API requires a Bearer token. Follow the steps below.
        </Typography>

        {/* Step 1 */}
        <Chip label="Step 1" color="primary" size="small" sx={{ mb: 1, fontWeight: 600 }} />
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Register via terminal to get your token
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          Run this command in PowerShell / Terminal with your actual details:
        </Typography>

        <Accordion disableGutters elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: "8px !important", mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="caption" fontWeight={600} color="primary">
              Show curl command
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                bgcolor: "#1e1e1e",
                color: "#d4d4d4",
                fontSize: "0.72rem",
                overflowX: "auto",
                borderRadius: "0 0 8px 8px",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {CURL_CMD}
            </Box>
            <Box display="flex" justifyContent="flex-end" p={1}>
              <Button
                size="small"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={handleCopy}
                color={copied ? "success" : "primary"}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Alert severity="info" sx={{ mb: 3, py: 0.5, fontSize: "0.78rem" }}>
          The response will contain a <strong>token</strong> field. Copy that value.
        </Alert>

        {/* Step 2 */}
        <Chip label="Step 2" color="primary" size="small" sx={{ mb: 1, fontWeight: 600 }} />
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Paste your token here
        </Typography>

        <TextField
          fullWidth
          size="small"
          multiline
          rows={3}
          placeholder="Paste your Bearer token here..."
          value={token}
          onChange={(e) => { setToken(e.target.value); setError(""); }}
          sx={{ mb: 1.5 }}
          error={!!error}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 1.5, py: 0 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSave}
          disabled={!token.trim()}
        >
          Save Token &amp; Open App
        </Button>
      </Paper>
    </Box>
  );
};

export default TokenSetup;
