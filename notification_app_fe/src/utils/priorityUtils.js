// Priority: Placement > Result > Event
const PRIORITY_MAP = { Placement: 3, Result: 2, Event: 1 };

export const getPriority = (type) => PRIORITY_MAP[type] ?? 0;

export const sortByPriority = (notifications) =>
  [...notifications].sort((a, b) => {
    const diff = getPriority(b.Type) - getPriority(a.Type);
    if (diff !== 0) return diff;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

export const getTopPriority = (notifications, count = 10) =>
  sortByPriority(notifications).slice(0, count);

export const NOTIFICATION_TYPES = ["All", "Placement", "Result", "Event"];

export const TYPE_COLOR = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

export const TYPE_BG = {
  Placement: "#e8f5e9",
  Result: "#fff8e1",
  Event: "#e3f2fd",
};
