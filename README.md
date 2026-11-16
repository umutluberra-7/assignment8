# Assignment 8 – Information Server

A small Node.js and Express 5 server for a made-up study programme
(Bachelor of Web Engineering). It serves a web page, several API routes
(text, JSON, redirect, errors) and logs and counts every request.

Author: Berra Ceyda Umutlu

## How to install and run

Requirements: Node.js (current LTS) and npm.

```bash
git clone https://github.com/umutluberra-7/assignment8.git
cd assignment8
npm install
npm start
```

Then open http://localhost:3000 in the browser.

- `npm start` runs the server with `node server.js`.
- `npm run dev` runs it with `node --watch server.js`, so it restarts automatically when a file changes.
- The port can be changed with an environment variable, for example `PORT=4000 npm start`. Without it the server uses port 3000.

## File organization

```
assignment8/
├─ public/
│  ├─ index.html      # page that explains the programme and has one button per API route
│  ├─ styles.css      # styles for the page
│  └─ app.js          # fetch() calls for the buttons, shows status code and body
├─ server.js          # Express app: middleware, routes, 404 fallback
├─ package.json       # "type": "module", scripts, express dependency
├─ package-lock.json  # exact versions of all installed packages
├─ .gitignore         # excludes node_modules/ and .env
└─ README.md
```

## Routes

| Method and path | Response |
|---|---|
| `GET /` | `public/index.html` (served by `express.static`) |
| `GET /hello` | Plain text greeting |
| `GET /robots.txt` | Plain text robots file |
| `GET /old-page` | `301` redirect to `/hello` |
| `GET /api/courses` | JSON array of courses |
| `GET /api/status` | JSON with status, Node version and uptime |
| `GET /api/headers` | JSON with the request's `User-Agent` and `Accept` headers |
| `POST /api/subscribe` | `201` with `{ "subscribed": true }` |
| `GET /api/admin` | `403` with `{ "error": "Forbidden" }` |
| `GET /api/stats` | JSON with the number of requests served |
| anything else | `404`: JSON for `/api/...` paths, plain text otherwise |