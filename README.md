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
## Middleware

### Order

The middleware and routes are registered in this order:

1. `requestLogger` – prints a timestamp, the method and the URL
2. `requestCounter` – increases the request counter
3. `express.static` – serves the files in `public/`
4. All routes (`/hello`, `/api/...`)
5. The 404 fallback

The logger and the counter are registered first because Express runs everything from top to bottom. If they were after the routes, a route would send the response first and the middleware would never run. `express.static` comes after them so that requests for `index.html`, `styles.css` and `app.js` are also logged and counted. The 404 fallback is last, so it only receives requests that no other route handled.

### Which requests are counted

Every request that reaches the server is counted: API calls, static files (HTML, CSS, JS), redirects, 404 responses and also the `/api/stats` request itself. I chose this because the counter should show how many requests the server really served, not only the API calls. In my test the first call to `/api/stats` returned `1` (the request counts itself), and after one `/hello` and one 404 request it returned `4`. When the page is opened in the browser the number goes up by 3 at once (HTML, CSS and JS). The counter is only kept in memory, so it goes back to 0 when the server restarts.

## Reasoning questions

### 1. Route order

I moved the 404 fallback to the top, right below `const app = express()`. After that every request returned 404, also real routes like `/hello`, `/api/courses` and `/api/stats`. Express checks middleware and routes in the order they are registered, and `app.use` without a path matches every request. So the fallback always matched first, sent the 404 response and the request never reached the real routes. Because it was also above the logger, those requests were not logged or counted.

### 2. Middleware

I removed `next()` from the logger. In Safari the page stayed blank and kept loading, and `curl --max-time 5` stopped with "Operation timed out after 5001 milliseconds with 0 bytes received". The server still printed the log line (`GET /hello`), so the logger itself ran. But without `next()` the request was never passed on to the route, so no response was ever sent and the request just hung.

### 3. Status codes

`201 Created` means that the request created something new, in this case a subscription, while `200 OK` only means that the request worked. A missing page must be `404` because browsers, `fetch()`, search engines and tools like curl read the status code first, not the text in the body. If the server sent `200` with an error message, a program would think the request was successful, and a search engine could even save the error page as a real page.

### 4. Configuration

The port is not always the same on every computer or server. Hosting platforms choose the port themselves and give it to the app in the `PORT` environment variable, and port 3000 can already be used by another program. With `process.env.PORT || 3000` the same code works everywhere without changes, and 3000 is only the default for local development. I tested this with `PORT=4000 npm start` and the server started on port 4000.

### 5. Dependencies

`node_modules` is very large and can always be created again from `package.json` and `package-lock.json`, so it does not belong in Git. Some packages are also built for a specific operating system. `package-lock.json` is committed so that everyone installs exactly the same versions. A teammate must run:

```bash
git clone https://github.com/umutluberra-7/assignment8.git
cd assignment8
npm install
npm start
```

### 6. Same origin

If `index.html` is opened directly from disk, the address starts with `file:///` and the page is not served by the server. The relative URL `/api/courses` then points to a file path on the disk instead of the server, so every fetch fails. Even with the full address `http://localhost:3000/api/courses`, the page and the API would have different origins, and the browser blocks reading the response. This restriction is called the **same-origin policy**. Because my page is served by the same Express server, the page and the API share the same origin and relative URLs work.

## Self-study notes

- **Node version and uptime:** In the Node documentation for the `process` object I found `process.version`, which returns the running Node version (for me `v24.21.0`), and `process.uptime()`, which returns the seconds since the process started. `uptime()` returns a decimal number, so I used `Math.floor()` in `/api/status`.
- **Plain text content type:** Express sends `res.send("some text")` as `text/html` by default. I saw this in curl for `/hello` before I fixed it. `res.type('text/plain')` sets the `Content-Type` header to `text/plain; charset=utf-8`. I used it for `/robots.txt`, `/hello` and the non-API 404 response.
- **Showing JSON neatly:** `JSON.stringify(data, null, 2)` turns an object into text with 2 spaces of indentation. In `app.js` I first read the response as text and try `JSON.parse`. If it works I show the formatted JSON in the `<pre>` element, otherwise I show the plain text.
- **Static files from any folder:** `express.static('public')` looks for the folder relative to the folder where the server was started. ES modules do not have `__dirname`, so I used `import.meta.dirname` with `path.join` to build the full path to `public`. I tested it by starting the server from my home folder with `node assignment8/server.js`, and the page still loaded.
- **fetch and errors:** `fetch()` does not throw an error for `403` or `404`, it only throws when the request cannot be sent at all. So the page always shows `response.status`, and a `try/catch` shows "Network error" when the server is not running (Safari shows the message "Load failed").

## Challenges

- My first `git push` failed with "Repository not found" because I forgot to put my GitHub username in the remote URL. I fixed it with `git remote set-url`.
- `npm init -y` wrote `"type": "commonjs"` into `package.json`, so I had to change it to `"module"` before `import` worked.
- Once the logger seemed not to work, but the reason was that I had not saved the file in VS Code, so `node --watch` did not restart.
- A test URL with a space (`/api/not exist`) broke curl ("Could not resolve host"), so I used hyphens in URLs.
- I created `README.md` inside `public/` by mistake and moved it to the project root, otherwise `express.static` would have served it.
- I had to plan my commits so the work is spread over several days and each commit contains one step.