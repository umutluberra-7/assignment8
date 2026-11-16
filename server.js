import express from 'express';
import path from 'node:path';

const app = express();

const PORT = process.env.PORT || 3000;

const courses = [
  { id: 1, title: 'Introduction to Web Programming', credits: 6 },
  { id: 2, title: 'Databases', credits: 5 },
  { id: 3, title: 'User Interface Design', credits: 4 },
  { id: 4, title: 'Software Engineering', credits: 6 }
];

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}
let requestCount = 0;

function requestCounter(req, res, next) {
  requestCount += 1;
  next();
}


app.use(requestLogger);
app.use(requestCounter);
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.get('/hello', (req, res) => {
  res.type('text/plain');
  res.send("Hello from Berra Ceyda Umutlu's server");
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /api/admin\n');
});

app.get('/old-page', (req, res) => {
  res.redirect(301, '/hello');
});

app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get('/api/headers', (req, res) => {
  res.json({
    userAgent: req.get('User-Agent'),
    accept: req.get('Accept')
  });
});

app.post('/api/subscribe', (req, res) => {
  res.status(201).json({ subscribed: true });
});

app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});
app.get('/api/stats', (req, res) => {
  res.json({ requestsServed: requestCount });
});

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.status(404).type('text/plain').send('404 - Page not found');
}); 



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});