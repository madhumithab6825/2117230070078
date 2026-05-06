/**
 * Stage 1 — Priority Inbox
 * Fetches notifications from the API and computes top-N priority notifications.
 * Priority: Placement (3) > Result (2) > Event (1), then by latest Timestamp.
 * Uses a Min-Heap to maintain top-N efficiently as new notifications arrive.
 */

const https = require("http");

// ─── Logging Middleware ───────────────────────────────────────────────────────
const Logger = (() => {
  const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
  const log = (level, ctx, msg, meta) => {
    const ts = new Date().toISOString();
    const line = `[${ts}] [${level}] [${ctx}] ${msg}`;
    if (level === "ERROR") console.error(line, meta != null ? meta : "");
    else if (level === "WARN") console.warn(line, meta != null ? meta : "");
    else console.info(line, meta != null ? meta : "");
  };
  return {
    debug: (ctx, msg, meta) => log("DEBUG", ctx, msg, meta),
    info: (ctx, msg, meta) => log("INFO", ctx, msg, meta),
    warn: (ctx, msg, meta) => log("WARN", ctx, msg, meta),
    error: (ctx, msg, meta) => log("ERROR", ctx, msg, meta),
  };
})();

// ─── Priority Config ──────────────────────────────────────────────────────────
const PRIORITY_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

const score = (n) => {
  const weight = PRIORITY_WEIGHT[n.Type] ?? 0;
  const ts = new Date(n.Timestamp).getTime() || 0;
  // Composite score: weight * large multiplier + timestamp (ms)
  return weight * 1e15 + ts;
};

// ─── Min-Heap (keyed by score) ────────────────────────────────────────────────
class MinHeap {
  constructor(capacity) {
    this.capacity = capacity;
    this.heap = [];
  }

  _parent(i) { return Math.floor((i - 1) / 2); }
  _left(i) { return 2 * i + 1; }
  _right(i) { return 2 * i + 2; }
  _swap(i, j) { [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]; }

  _bubbleUp(i) {
    while (i > 0 && this.heap[this._parent(i)].score > this.heap[i].score) {
      this._swap(i, this._parent(i));
      i = this._parent(i);
    }
  }

  _siftDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = this._left(i), r = this._right(i);
      if (l < n && this.heap[l].score < this.heap[smallest].score) smallest = l;
      if (r < n && this.heap[r].score < this.heap[smallest].score) smallest = r;
      if (smallest === i) break;
      this._swap(i, smallest);
      i = smallest;
    }
  }

  push(item) {
    const entry = { score: score(item), data: item };
    if (this.heap.length < this.capacity) {
      this.heap.push(entry);
      this._bubbleUp(this.heap.length - 1);
      Logger.debug("MinHeap", `Inserted: ${item.Type} | score=${entry.score}`);
    } else if (entry.score > this.heap[0].score) {
      Logger.debug("MinHeap", `Replacing min: ${this.heap[0].data.Type} with ${item.Type}`);
      this.heap[0] = entry;
      this._siftDown(0);
    } else {
      Logger.debug("MinHeap", `Skipped (below threshold): ${item.Type}`);
    }
  }

  // Returns top-N sorted descending (highest priority first)
  getTopN() {
    return [...this.heap]
      .sort((a, b) => b.score - a.score)
      .map((e) => e.data);
  }
}

// ─── API Fetch ────────────────────────────────────────────────────────────────
const fetchNotifications = () =>
  new Promise((resolve, reject) => {
    const url = "http://20.207.122.201/evaluation-service/notifications";
    Logger.info("API", `GET ${url}`);
    https.get(url, (res) => {
      let raw = "";
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => {
        Logger.info("API", `Response status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(raw);
          const list = Array.isArray(parsed) ? parsed : parsed.notifications ?? [];
          Logger.info("API", `Fetched ${list.length} notifications`);
          resolve(list);
        } catch (e) {
          Logger.error("API", "JSON parse error", e.message);
          reject(e);
        }
      });
    }).on("error", (e) => {
      Logger.error("API", "Request failed", e.message);
      reject(e);
    });
  });

// ─── Main ─────────────────────────────────────────────────────────────────────
const TOP_N = 10;

const computePriorityInbox = async (n = TOP_N) => {
  Logger.info("Main", `Computing top ${n} priority notifications`);
  const notifications = await fetchNotifications();

  const heap = new MinHeap(n);
  for (const notif of notifications) {
    heap.push(notif);
  }

  const topN = heap.getTopN();
  Logger.info("Main", `Top ${n} priority notifications computed`, { count: topN.length });

  console.info("\n========== TOP " + n + " PRIORITY NOTIFICATIONS ==========");
  topN.forEach((notif, idx) => {
    console.info(
      `#${idx + 1} | [${notif.Type.padEnd(9)}] | ${notif.Timestamp} | ${notif.Message}`
    );
  });
  console.info("=".repeat(52));

  return topN;
};

// Simulate streaming: add a new notification and update heap
const simulateNewNotification = (heap, newNotif) => {
  Logger.info("Stream", "New notification arrived", newNotif);
  heap.push(newNotif);
  Logger.info("Stream", "Heap updated. Current top:", heap.getTopN()[0]);
};

computePriorityInbox(TOP_N).catch((err) => {
  Logger.error("Main", "Fatal error", err.message);
  process.exit(1);
});
