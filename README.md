# Campus Notifications Microservice

## Repository Structure
```
ROLLNUMBER/
├── logging_middleware/          # Pre-test logging middleware
├── notification_app_fe/         # Stage 2 — React frontend
├── priority_inbox.js            # Stage 1 — Priority algorithm (Node.js)
├── Notification_System_Design.md
└── .gitignore
```

---

## Stage 1 — Priority Inbox

### Run
```bash
node priority_inbox.js
```

### What it does
- Fetches all notifications from the API
- Uses a **Min-Heap of size N** to compute top-10 priority notifications
- Priority: Placement > Result > Event, then by latest timestamp
- Handles streaming notifications in O(log N) per update

---

## Stage 2 — React Frontend

### Setup
```bash
cd notification_app_fe
npm install
npm start
```
App runs at **http://localhost:3000**

### Features
| Feature | Details |
|---|---|
| All Notifications | Server-side pagination (5/page), type filter |
| Priority Inbox | Top-N (5/10/15/20) client-side, type filter, rank badges |
| Viewed/Unviewed | localStorage persistence, visual distinction |
| Responsive | Mobile + Desktop via MUI |
| Error Handling | API errors shown with retry option |
| Logging | All logs via custom Logger middleware |

### Tech Stack
- React 18
- Material UI v5
- Axios
- localStorage for state persistence

---

## API
```
GET http://20.207.122.201/evaluation-service/notifications
  ?page=1&limit=5&notification_type=Placement
```

### Response
```json
{
  "notifications": [
    { "ID": "...", "Type": "Placement", "Message": "...", "Timestamp": "2026-04-22 17:51:18" }
  ],
  "total": 42
}
```
