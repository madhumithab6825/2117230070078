import axios from "axios";
import Logger from "../utils/logger";

const CTX = "NotificationService";
const BASE_URL = "http://20.207.122.201/evaluation-service";

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

api.interceptors.request.use((config) => {
  Logger.info(CTX, `Request: ${config.method?.toUpperCase()} ${config.url}`, config.params);
  return config;
});

api.interceptors.response.use(
  (res) => {
    Logger.info(CTX, `Response: ${res.status} ${res.config.url}`);
    return res;
  },
  (err) => {
    Logger.error(CTX, "API Error", {
      message: err.message,
      status: err.response?.status,
      url: err.config?.url,
    });
    return Promise.reject(err);
  }
);

// Server-side paginated fetch (used by All Notifications page)
export const fetchNotificationsPaginated = async ({ page = 1, limit = 5, type = "" } = {}) => {
  const params = { page, limit };
  if (type && type !== "All") params.notification_type = type;
  const res = await api.get("/notifications", { params });
  Logger.debug(CTX, "Paginated fetch complete", { page, limit, type });
  return res.data; // { notifications: [...], total, page, limit }
};

// Fetch all notifications at once (used by Priority Inbox — needs full dataset)
export const fetchAllNotifications = async () => {
  Logger.info(CTX, "Fetching all notifications for priority computation");
  const res = await api.get("/notifications", { params: { limit: 1000 } });
  const data = res.data;
  return Array.isArray(data) ? data : data.notifications ?? [];
};
