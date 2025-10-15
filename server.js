const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'my-frontend')));

// API ключ Новой Почты
const NOVA_POSHTA_API_KEY = 'cce05dcb7ac3f0d2937378ef3c93b2bb';
const NOVA_POSHTA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

// Функция для запросов к API Новой Почты
async function callNovaPoshtaAPI(modelName, methodName, methodProperties) {
  try {
    const response = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: NOVA_POSHTA_API_KEY,
      modelName,
      calledMethod: methodName,
      methodProperties
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Помилка з\'єднання з API Нова Пошта');
  }
}

// Все остальные маршруты остаются такими же...

// Обслуживание фронтенда
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});