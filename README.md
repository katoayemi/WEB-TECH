# Student Registration System

A production-ready full-stack web application built with **Node.js**, **Express**, and **MySQL**.

---

## Folder Structure

```
student-registration/
├── public/                    ← Static frontend (served by Express)
│   ├── index.html             ← Registration page
│   ├── css/
│   │   └── style.css          ← Styles
│   └── js/
│       └── reg.js             ← Frontend: validation + API calls
│
├── src/
│   ├── server.js              ← Entry point — Express app
│   ├── config/
│   │   └── db.js              ← MySQL connection pool
│   ├── controllers/
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── errorHandler.js    ← Global errors + async wrapper
│   │   └── validation.js      ← express-validator rules
│   ├── models/
│   │   └── studentModel.js    ← All SQL queries
│   └── routes/
│       └── studentRoutes.js
│
├── schema.sql                 ← Database + table definitions
├── .env.example               ← Copy to .env and fill in secrets
├── .gitignore
├── package.json
└── README.md
```

---

## 1 — Prerequisites

| Tool    | Minimum version |
|---------|----------------|
| Node.js | 18.x           |
| npm     | 9.x            |
| MySQL   | 8.x            |

---

## 2 — Database Setup

```bash
# Log in to MySQL as root (or any privileged user)
mysql -u root -p

# Run the schema file — creates DB + tables automatically
source /path/to/schema.sql
# OR
mysql -u root -p < schema.sql
```

Tables created:
- **students** — stores name, roll_number (UUID primary key)
- **registration_logs** — immutable audit trail of every action

---

## 3 — Local Development

```bash
# 1. Clone / unzip the project
cd student-registration

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Edit .env and set:
#   DB_PASSWORD=<your MySQL password>
#   DB_USER=root
#   DB_NAME=student_registration

# 4. Start the dev server (auto-restarts on changes)
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 4 — API Endpoints

### `POST /api/students`
Register a new student.

**Request body (JSON)**
```json
{ "name": "Priya Sharma", "roll": "CS2024001" }
```

**Responses**
| Status | Meaning |
|--------|---------|
| 201    | Created successfully |
| 409    | Roll number already exists |
| 422    | Validation error (bad input) |
| 500    | Server / DB error |

---

### `GET /api/students?page=1&limit=20`
List all registered students (paginated).

**Response**
```json
{
  "success": true,
  "students": [{ "id": "...", "name": "Priya Sharma", "roll_number": "CS2024001", "created_at": "..." }],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

### `GET /api/health`
Health-check for load balancers / uptime monitors.

---

## 5 — Security Features

| Feature | Implementation |
|---------|---------------|
| Security headers | `helmet` (CSP, HSTS, X-Frame-Options, …) |
| CORS whitelist | Only origins in `ALLOWED_ORIGINS` env var |
| Rate limiting | 100 req / 15 min per IP on `/api/*` |
| Input sanitization | `express-validator` strips & validates all fields |
| SQL injection | Parameterized queries via `mysql2` — no string interpolation |
| XSS (frontend) | `escHtml()` used before inserting DB values into DOM |
| Body size limit | `10kb` max request body |
| Audit logs | Every create/update/delete recorded with IP address |

---

## 6 — Production Deployment

### A) Set environment variables on your server

```bash
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=strong-password
DB_NAME=student_registration
ALLOWED_ORIGINS=https://yourdomain.com
```

### B) Start with PM2 (recommended)

```bash
npm install -g pm2
pm2 start src/server.js --name student-reg
pm2 save
pm2 startup   # register as system service
```

### C) Nginx reverse proxy (example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then obtain an SSL certificate with **Certbot**:

```bash
sudo certbot --nginx -d yourdomain.com
```

### D) Docker (optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

```bash
docker build -t student-reg .
docker run -d -p 3000:3000 --env-file .env student-reg
```

---

## 7 — Extending the Project

- **Authentication** — add `jsonwebtoken` + admin login to protect the `/api/students` GET route.
- **File uploads** — add profile photo via `multer`.
- **Email confirmation** — add `nodemailer` to send a welcome email on registration.
- **CSV export** — add a `GET /api/students/export` route that streams a CSV.
