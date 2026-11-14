import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  res.send("Hello from Berra Ceyda Umutlu's server");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});