import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notificationService";
import { sortByPriority, getTopPriority } from "../utils/priorityUtils";

const PAGE_SIZE = 5;

export const useNotifications = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "priority"
  const [page, setPage] = useState(1);
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("viewedIds") || "[]"));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNotifications();
        setAllNotifications(Array.isArray(data) ? data : data.notifications ?? []);
      } catch (err) {
        setError(err.message || "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markViewed = useCallback((id) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("viewedIds", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const markAllViewed = useCallback((ids) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      localStorage.setItem("viewedIds", JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Derive displayed notifications
  const baseList =
    activeTab === "priority"
      ? getTopPriority(allNotifications)
      : sortByPriority(allNotifications);

  const filtered =
    filterType === "All"
      ? baseList
      : baseList.filter((n) => n.type === filterType);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (type) => {
    setFilterType(type);
    setPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setFilterType("All");
  };

  return {
    notifications: paginated,
    allFiltered: filtered,
    loading,
    error,
    filterType,
    activeTab,
    page,
    totalPages,
    viewedIds,
    markViewed,
    markAllViewed,
    handleFilterChange,
    handleTabChange,
    setPage,
  };
};
