import React, { useEffect } from "react";
import {
  Box, Typography, Skeleton, Divider, Chip, Select, MenuItem,
  FormControl, InputLabel, Alert, Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { usePriorityNotifications } from "../hooks/usePriorityNotifications";
import { useViewedState } from "../hooks/useViewedState";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import { ErrorState, EmptyState } from "../components/StatusStates";
import Logger from "../utils/logger";

const CTX = "PriorityInboxPage";
const TOP_N_OPTIONS = [5, 10, 15, 20];

const PriorityInboxPage = () => {
  const { notifications, loading, error, topN, setTopN, filterType, handleFilterChange, totalFetched } =
    usePriorityNotifications();
  const { markViewed, markAllViewed, isViewed } = useViewedState();

  useEffect(() => {
    Logger.info(CTX, "Priority inbox rendered", { topN, filterType });
  }, [topN, filterType]);

  const handleMarkAll = () => {
    const ids = notifications.map((n) => n.ID);
    markAllViewed(ids);
    Logger.info(CTX, "Marked all priority notifications as viewed");
  };

  const unviewedCount = notifications.filter((n) => !isViewed(n.ID)).length;

  return (
    <Box>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1} flexWrap="wrap" gap={1}>
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <StarIcon color="warning" />
            <Typography variant="h6" fontWeight={700}>Priority Inbox</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Top {topN} notifications ranked by type weight &amp; recency
            {totalFetched > 0 && ` · from ${totalFetched} total`}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          {unviewedCount > 0 && (
            <Button size="small" variant="outlined" onClick={handleMarkAll}>
              Mark all as viewed
            </Button>
          )}
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Show top</InputLabel>
            <Select
              value={topN}
              label="Show top"
              onChange={(e) => {
                Logger.debug(CTX, "topN changed", e.target.value);
                setTopN(e.target.value);
              }}
            >
              {TOP_N_OPTIONS.map((n) => (
                <MenuItem key={n} value={n}>Top {n}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Alert severity="info" icon={<StarIcon fontSize="small" />} sx={{ mb: 2, py: 0.5 }}>
        Priority order: <strong>Placement</strong> &gt; <strong>Result</strong> &gt; <strong>Event</strong>, then by latest timestamp
      </Alert>

      <FilterBar value={filterType} onChange={handleFilterChange} />
      <Divider sx={{ mb: 2 }} />

      {loading && (
        <Box>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 1.5, borderRadius: 2 }} />
          ))}
        </Box>
      )}

      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && notifications.length === 0 && (
        <EmptyState message="No priority notifications match the selected filter." />
      )}

      {!loading && !error && notifications.map((n, idx) => (
        <Box key={n.ID} position="relative">
          <Chip
            label={`#${idx + 1}`}
            size="small"
            color="warning"
            sx={{
              position: "absolute", top: 8, right: 48, zIndex: 1,
              fontSize: "0.65rem", height: 18, fontWeight: 700,
            }}
          />
          <NotificationCard
            notification={n}
            isViewed={isViewed(n.ID)}
            onView={markViewed}
          />
        </Box>
      ))}
    </Box>
  );
};

export default PriorityInboxPage;
