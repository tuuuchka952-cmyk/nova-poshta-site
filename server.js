const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'my-frontend')));

// Простой тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ message: 'API работает!', timestamp: new Date() });
});

// Все остальные запросы направляем на фронтенд
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-frontend', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('=== SERVER STARTED ===');
  console.log('Port:', PORT);
  console.log('Directory:', __dirname);
  console.log('Frontend exists:', require('fs').existsSync(path.join(__dirname, 'my-frontend')));
  console.log(`Server: http://localhost:${PORT}`);
});