import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidayion } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';  // Исправлен путь к UserController
import * as PostController from './controllers/PostController.js';  // Привел к единому стилю


const URL = 'mongodb+srv://lepeha:Pass123@cluster0myself.ij4cz.mongodb.net/';

mongoose
  .connect(URL)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json()); // чтобы express распознавал JSON

// Логин пользователя
app.post('/auth/login', loginValidation, UserController.login);

// Регистрация пользователя
app.post('/auth/register', registerValidation, UserController.register);  // Исправлено имя функции

app.get('/auth/me', checkAuth, UserController.getme); // Получение данных о пользователе

app.post('/posts', checkAuth, postCreateValidayion, PostController.create); // Создание статьи
app.get('/posts', PostController.getAll); // получение всех статей
app.get('/posts/:id', PostController.getOne); // для получения оной статьи
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', PostController.update);

// Запуск сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
