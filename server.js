import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

const courses = [
  { id: 1, title: 'Introduction to Web Programming', credits: 6 },
  { id: 2, title: 'Databases', credits: 5 },
  { id: 3, title: 'User Interface Design', credits: 4 },
  { id: 4, title: 'Software Engineering', credits: 6 }
];
app.get('/hello', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});