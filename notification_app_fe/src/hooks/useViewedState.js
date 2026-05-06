import { useState, useCallback } from "react";
import Logger from "../utils/logger";

const CTX = "useViewedState";
const STORAGE_KEY = "campus_viewed_ids";

const loadViewed = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    Logger.warn(CTX, "Failed to parse viewedIds from localStorage");
    return new Set();
  }
};

const persist = (set) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
};

export const useViewedState = () => {
  const [viewedIds, setViewedIds] = useState(loadViewed);

  const markViewed = useCallback((id) => {
    setViewedIds((prev) => {
      if (prev.has(id)) return prev;
      Logger.debug(CTX, "Marking viewed", id);
      const next = new Set(prev);
      next.add(id);
      persist(next);
      return next;
    });
  }, []);

  const markAllViewed = useCallback((ids) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      Logger.info(CTX, `Marked ${ids.length} notifications as viewed`);
      persist(next);
      return next;
    });
  }, []);

  const isViewed = useCallback((id) => viewedIds.has(id), [viewedIds]);

  return { viewedIds, markViewed, markAllViewed, isViewed };
};
