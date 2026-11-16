# Assignment 8 – Information Server

A small Node.js and Express 5 server for a made-up study programme
(Bachelor of Web Engineering). It serves a web page, several API routes
(text, JSON, redirect, errors) and logs and counts every request.

Author: Berra Ceyda Umutlu 230408024 

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

## Testing evidence (curl)

All tests were run with `curl --include` while the server was running on port 3000.

### 1. Successful JSON response – `GET /api/courses`

```
$ curl --include http://localhost:3000/api/courses
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 210
ETag: W/"d2-97/Qj4jU+/duQd/5jI6Vh4gq5RQ"
Date: Mon, 16 Nov 2026 16:00:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Introduction to Web Programming","credits":6},{"id":2,"title":"Databases","credits":5},{"id":3,"title":"User Interface Design","credits":4},{"id":4,"title":"Software Engineering","credits":6}]
```

### 2. Created – `POST /api/subscribe`

```
$ curl --include -X POST http://localhost:3000/api/subscribe
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Sun, 15 Nov 2026 12:03:28 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}
```

### 3. Forbidden – `GET /api/admin`

```
$ curl --include http://localhost:3000/api/admin
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Sun, 15 Nov 2026 12:03:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}
```

### 4. Redirect – `GET /old-page`

```
$ curl --include http://localhost:3000/old-page
HTTP/1.1 301 Moved Permanently
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 40
Date: Sat, 14 Nov 2026 19:57:43 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Moved Permanently. Redirecting to /hello
```

### 5. 404 on an API path – `GET /api/not-exist`

```
$ curl --include http://localhost:3000/api/not-exist
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Mon, 16 Nov 2026 15:59:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}
```

### 6. 404 on a non-API path – `GET /not-exist`

```
$ curl --include http://localhost:3000/not-exist
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 20
ETag: W/"14-uqvetqrE8oeY4r2Xn8/CTahXnYE"
Date: Mon, 16 Nov 2026 15:59:57 GMT
Connection: keep-alive
Keep-Alive: timeout=5

404 - Page not found
```