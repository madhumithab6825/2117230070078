import { useState, useEffect } from "react";
import { fetchNotificationsPaginated } from "../api/notificationService";
import Logger from "../utils/logger";

const CTX = "useAllNotifications";
const PAGE_SIZE = 5;

export const useAllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        Logger.info(CTX, "Fetching page", { page, filterType });
        const data = await fetchNotificationsPaginated({ page, limit: PAGE_SIZE, type: filterType });
        if (!cancelled) {
          setNotifications(Array.isArray(data) ? data : data.notifications ?? []);
          setTotal(data.total ?? data.notifications?.length ?? 0);
        }
      } catch (err) {
        if (!cancelled) {
          Logger.error(CTX, "Fetch failed", err.message);
          setError("Unable to load notifications. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page, filterType]);

  const handleFilterChange = (type) => {
    Logger.debug(CTX, "Filter changed", type);
    setFilterType(type);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return { notifications, loading, error, page, totalPages, filterType, handleFilterChange, setPage };
};
