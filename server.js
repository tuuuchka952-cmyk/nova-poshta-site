import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Получаем __dirname для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Маршруты API
app.post('/api/cities', async (req, res) => {
  try {
    const { search } = req.body;
    
    const result = await callNovaPoshtaAPI('Address', 'searchSettlements', {
      CityName: search,
      Limit: 20,
      Page: 1
    });

    if (result.success) {
      const cities = result.data[0].Addresses.map(city => ({
        name: city.Present,
        ref: city.DeliveryCity,
        area: city.Area,
        region: city.Region
      }));
      res.json(cities);
    } else {
      res.status(400).json({ error: result.errors });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const { cityRef, search } = req.body;
    
    const result = await callNovaPoshtaAPI('Address', 'getWarehouses', {
      CityRef: cityRef,
      FindByString: search,
      Limit: 50,
      Page: 1
    });

    if (result.success) {
      const departments = result.data.map(dep => ({
        name: dep.Description,
        address: dep.ShortAddress,
        ref: dep.Ref,
        number: dep.Number,
        type: dep.TypeOfWarehouse
      }));
      res.json(departments);
    } else {
      res.status(400).json({ error: result.errors });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/postmats', async (req, res) => {
  try {
    const { cityRef, search } = req.body;
    
    const result = await callNovaPoshtaAPI('Address', 'getWarehouses', {
      CityRef: cityRef,
      FindByString: search,
      Limit: 50,
      Page: 1
    });

    if (result.success) {
      const postmats = result.data
        .filter(dep => dep.TypeOfWarehouse === '9a68df70-0267-42a8-bb5c-37f427e36ee4')
        .map(dep => ({
          name: dep.Description,
          address: dep.ShortAddress,
          ref: dep.Ref,
          number: dep.Number,
          type: 'postmat'
        }));
      res.json(postmats);
    } else {
      res.status(400).json({ error: result.errors });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/order', async (req, res) => {
  try {
    const { fullName, phone, service, city, department } = req.body;
    
    console.log('Новый заказ:', {
      fullName,
      phone,
      service,
      city,
      department
    });

    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    res.json({
      success: true,
      orderNumber,
      message: 'Замовлення успішно створено'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
  console.log(`Фронтенд доступен по адресу: http://localhost:${PORT}`);
});