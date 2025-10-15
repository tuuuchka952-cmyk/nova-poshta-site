const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'my-frontend')));

// Простой тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ message: 'API работает!' });
});

// Все остальные запросы направляем на фронтенд
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log('=== SERVER STARTED ===');
  console.log('Port:', PORT);
  console.log('Directory:', __dirname);
  console.log('Frontend path:', path.join(__dirname, 'my-frontend'));
  console.log(`Server: http://localhost:${PORT}`);
});