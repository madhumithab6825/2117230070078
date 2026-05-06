# Notification System Design

## Stage 1 — Priority Inbox Algorithm

### Problem
Students receive high volumes of campus notifications (Placements, Results, Events). They lose track of important ones. We need a **Priority Inbox** that always surfaces the top-N most important unread notifications.

### Priority Rules
| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

Within the same type, **more recent notifications rank higher** (sorted by Timestamp descending).

### Composite Score Formula
```
score(n) = weight(n.Type) × 10^15 + unix_timestamp_ms(n.Timestamp)
```
Multiplying weight by `10^15` ensures type weight always dominates over timestamp differences, while still allowing recency to break ties within the same type.

### Data Structure — Min-Heap of size N
A **Min-Heap** of fixed capacity N is used to maintain the top-N notifications efficiently.

**Why Min-Heap?**
- The root always holds the *lowest-priority* item among the current top-N.
- When a new notification arrives, compare its score with the root:
  - If `new.score > root.score` → replace root and sift down → O(log N)
  - Otherwise → discard → O(1)
- This gives **O(log N) per insertion** vs O(N log N) for full re-sort.

**Handling Streaming Notifications**
```
for each new notification n:
    if heap.size < N:
        heap.push(n)          // O(log N)
    elif score(n) > heap.min:
        heap.replaceMin(n)    // O(log N)
    else:
        discard               // O(1)
```
The heap always contains exactly the top-N notifications. No full re-sort needed.

### Complexity
| Operation         | Time       | Space  |
|-------------------|------------|--------|
| Initial build     | O(M log N) | O(N)   |
| New notification  | O(log N)   | O(N)   |
| Get top-N         | O(N log N) | O(N)   |

Where M = total notifications, N = top-N size.

### Output
Running `node priority_inbox.js` fetches live data from the API and prints the top-10 priority notifications ranked by the algorithm above.

---

## Stage 2 — React Frontend

### Architecture
```
notification_app_fe/
├── src/
│   ├── api/
│   │   └── notificationService.js   # Axios client, interceptors
│   ├── components/
│   │   ├── Navbar.jsx               # Tab navigation
│   │   ├── NotificationCard.jsx     # Card with viewed/unviewed state
│   │   ├── FilterBar.jsx            # Type filter chips
│   │   └── StatusStates.jsx         # Error + Empty states
│   ├── hooks/
│   │   ├── useAllNotifications.js   # Server-side pagination + filter
│   │   ├── usePriorityNotifications.js  # Client-side top-N priority
│   │   └── useViewedState.js        # localStorage viewed tracking
│   ├── pages/
│   │   ├── AllNotificationsPage.jsx
│   │   └── PriorityInboxPage.jsx
│   └── utils/
│       ├── logger.js                # Logging middleware
│       └── priorityUtils.js        # Priority algorithm
```

### Pages

#### All Notifications
- Uses API query params (`page`, `limit`, `notification_type`) for server-side pagination and filtering.
- MUI `Pagination` component for page navigation.
- Filter chips for Placement / Result / Event / All.
- Viewed/unviewed distinction via localStorage.

#### Priority Inbox
- Fetches all notifications once (large limit), computes top-N client-side using the Min-Heap algorithm.
- User can select N from {5, 10, 15, 20} via a dropdown.
- Type filter applied after priority ranking.
- Rank badge (#1, #2, ...) shown on each card.
- Priority legend shown as an info alert.

### Viewed/Unviewed State
- Tracked in `localStorage` under key `campus_viewed_ids`.
- Unread cards have colored left border + "New" chip + bold text.
- Read cards are muted (opacity 0.75, grey border).
- "Mark all as viewed" button marks all currently visible notifications.
- State persists across page refreshes.

### Logging Middleware
All modules use `Logger` from `utils/logger.js`. No direct `console.log` calls anywhere. Logger supports DEBUG / INFO / WARN / ERROR levels with timestamp, context, and metadata.

### API Integration
- `fetchNotificationsPaginated({ page, limit, type })` — used by All Notifications page.
- `fetchAllNotifications()` — fetches with `limit=1000` for priority computation.
- Axios interceptors log every request and response.
- Errors are caught and displayed via `ErrorState` component.

### Responsive Design
- MUI `Container maxWidth="md"` constrains width on desktop.
- `Navbar` stacks vertically on mobile (`useMediaQuery`).
- Cards use `flexWrap` and `wordBreak` for small screens.
- Tested on 375px (mobile) and 1280px (desktop).
