import express from 'express';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from "../controllers/UserController.js";
import User from './Models/User.js';

const URL = 'mongodb+srv://lepeha:Pass123@cluster0myself.ij4cz.mongodb.net/';

mongoose
  .connect(URL)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json()); // чтобы express распознавал JSON
// Логин пользователя
app.post('/auth/login', UserController.login)
// Маршрут регистрации или логина
app.post('/auth/register', UserController.regiter)
// Получение данных о пользователе
app.get('/auth/me', UserController.getme)

// Запуск сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
