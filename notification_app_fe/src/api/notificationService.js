import axios from "axios";
import Logger from "../utils/logger";

const CTX = "NotificationService";
const BASE_URL = "http://20.207.122.201/evaluation-service";
const TOKEN_KEY = "campus_auth_token";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  Logger.info(CTX, "Auth token saved");
};
export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  Logger.warn(CTX, "Auth token cleared");
};

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  Logger.info(CTX, `Request: ${config.method?.toUpperCase()} ${config.url}`, config.params);
  return config;
});

api.interceptors.response.use(
  (res) => {
    Logger.info(CTX, `Response: ${res.status} ${res.config.url}`);
    return res;
  },
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data?.message || err.message;
    Logger.error(CTX, `API Error [${status}]`, { msg, url: err.config?.url });
    return Promise.reject(err);
  }
);

// ── Mock data fallback ────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  { ID: "1a2b3c", Type: "Placement", Message: "Google hiring — Software Engineer 2025", Timestamp: "2026-04-22 17:51:30" },
  { ID: "2b3c4d", Type: "Placement", Message: "Microsoft on-campus drive — April 28", Timestamp: "2026-04-22 17:48:00" },
  { ID: "3c4d5e", Type: "Placement", Message: "Amazon SDE internship — apply by April 25", Timestamp: "2026-04-21 10:00:00" },
  { ID: "4d5e6f", Type: "Result", Message: "Mid-semester results published", Timestamp: "2026-04-22 17:51:18" },
  { ID: "5e6f7g", Type: "Result", Message: "Lab exam results — check portal", Timestamp: "2026-04-22 15:30:00" },
  { ID: "6f7g8h", Type: "Result", Message: "Project evaluation marks updated", Timestamp: "2026-04-21 09:00:00" },
  { ID: "7g8h9i", Type: "Event", Message: "Farewell ceremony — May 5th, Main Hall", Timestamp: "2026-04-22 17:51:06" },
  { ID: "8h9i0j", Type: "Event", Message: "Hackathon 2025 — Register before April 30", Timestamp: "2026-04-22 12:00:00" },
  { ID: "9i0j1k", Type: "Event", Message: "Alumni meet — April 27, Auditorium", Timestamp: "2026-04-20 08:00:00" },
  { ID: "0j1k2l", Type: "Placement", Message: "TCS NQT results — check email", Timestamp: "2026-04-19 17:00:00" },
  { ID: "1k2l3m", Type: "Result", Message: "End semester timetable released", Timestamp: "2026-04-18 11:00:00" },
  { ID: "2l3m4n", Type: "Event", Message: "Sports day — April 29, Ground", Timestamp: "2026-04-17 09:00:00" },
];

const getMockPaginated = ({ page = 1, limit = 5, type = "" }) => {
  let data = [...MOCK_NOTIFICATIONS];
  if (type && type !== "All") data = data.filter((n) => n.Type === type);
  const total = data.length;
  const notifications = data.slice((page - 1) * limit, page * limit);
  return { notifications, total, page, limit };
};

// ── API calls with mock fallback ──────────────────────────────────────────────
export const fetchNotificationsPaginated = async ({ page = 1, limit = 5, type = "" } = {}) => {
  const params = { page, limit };
  if (type && type !== "All") params.notification_type = type;
  try {
    const res = await api.get("/notifications", { params });
    Logger.debug(CTX, "Paginated fetch complete", { page, limit, type });
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    Logger.warn(CTX, "API failed — using mock data", { status });
    return getMockPaginated({ page, limit, type });
  }
};

export const fetchAllNotifications = async () => {
  Logger.info(CTX, "Fetching all notifications for priority computation");
  try {
    const res = await api.get("/notifications", { params: { limit: 1000 } });
    const data = res.data;
    return Array.isArray(data) ? data : data.notifications ?? [];
  } catch (err) {
    const status = err.response?.status;
    Logger.warn(CTX, "API failed — using mock data", { status });
    return MOCK_NOTIFICATIONS;
  }
};
