import { useState, useEffect, useMemo } from "react";
import { fetchAllNotifications } from "../api/notificationService";
import { getTopPriority, sortByPriority } from "../utils/priorityUtils";
import Logger from "../utils/logger";

const CTX = "usePriorityNotifications";

export const usePriorityNotifications = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllNotifications();
        Logger.info(CTX, `Fetched ${data.length} notifications`);
        setAllData(data);
      } catch (err) {
        Logger.error(CTX, "Fetch failed", err.message);
        setError("Unable to load priority notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const priorityList = useMemo(() => {
    Logger.debug(CTX, `Computing top ${topN} priority notifications`);
    return getTopPriority(allData, topN);
  }, [allData, topN]);

  const filtered = useMemo(
    () => filterType === "All" ? priorityList : priorityList.filter((n) => n.Type === filterType),
    [priorityList, filterType]
  );

  const handleFilterChange = (type) => {
    Logger.debug(CTX, "Filter changed", type);
    setFilterType(type);
  };

  return { notifications: filtered, loading, error, topN, setTopN, filterType, handleFilterChange, totalFetched: allData.length };
};
