import React, { useEffect } from "react";
import {
  Box, Typography, Pagination, Skeleton, Button, Divider,
} from "@mui/material";
import { useAllNotifications } from "../hooks/useAllNotifications";
import { useViewedState } from "../hooks/useViewedState";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import { ErrorState, EmptyState } from "../components/StatusStates";
import Logger from "../utils/logger";

const CTX = "AllNotificationsPage";

const AllNotificationsPage = () => {
  const { notifications, loading, error, page, totalPages, filterType, handleFilterChange, setPage } =
    useAllNotifications();
  const { markViewed, markAllViewed, isViewed } = useViewedState();

  useEffect(() => {
    Logger.info(CTX, "Page rendered", { page, filterType });
  }, [page, filterType]);

  const handleMarkAll = () => {
    const ids = notifications.map((n) => n.ID);
    markAllViewed(ids);
    Logger.info(CTX, "Marked all visible as viewed");
  };

  const unviewedCount = notifications.filter((n) => !isViewed(n.ID)).length;

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h6" fontWeight={700}>All Notifications</Typography>
          <Typography variant="caption" color="text.secondary">
            {unviewedCount > 0 ? `${unviewedCount} unread` : "All caught up!"}
          </Typography>
        </Box>
        {unviewedCount > 0 && (
          <Button size="small" variant="outlined" onClick={handleMarkAll}>
            Mark all as viewed
          </Button>
        )}
      </Box>

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
        <EmptyState message="No notifications match the selected filter." />
      )}

      {!loading && !error && notifications.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isViewed={isViewed(n.ID)}
          onView={markViewed}
        />
      ))}

      {!loading && !error && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => {
              Logger.debug(CTX, "Page changed", v);
              setPage(v);
            }}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default AllNotificationsPage;
